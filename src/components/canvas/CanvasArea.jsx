import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { Stage, Layer, Line, Rect, Circle, Text, Image, Transformer } from 'react-konva';
import { toolState, colorState } from '../../recoil/canvasToolAtoms';
import { createCanvas, getCanvasByTeamID } from '../../service/CanvasService';
import { uploadImage } from '../../service/ImageService';
import useImage from 'use-image';

const CanvasArea = forwardRef(({ teamId, yDoc, provider, awareness, canvasSize, onZoom, canvasId, title, image }, ref) => {
  const [tool, setTool] = useRecoilState(toolState);
  const color = useRecoilValue(colorState);
  const stageRef = useRef(null);
  const layerRef = useRef(null);
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentShape, setCurrentShape] = useState(null);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [textEditVisible, setTextEditVisible] = useState(false);
  const [textEditValue, setTextEditValue] = useState('');
  const [textEditIndex, setTextEditIndex] = useState(null);
  const transformerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursors, setCursors] = useState({});
  const [loadedImage] = useImage(image);

  useEffect(() => {
    const yShapes = yDoc.getArray('shapes');

    const updateKonvaShapes = async () => {
      const newShapes = yShapes.toArray();

      const processedShapes = await Promise.all(
        newShapes.map(async (shape) => {
          if (shape.tool === 'image' && shape.imageUrl) {
            return new Promise((resolve) => {
              const img = new window.Image();
              img.src = shape.imageUrl;
              img.onload = () => {
                resolve({ ...shape, image: img });
              };
              img.onerror = () => {
                console.error('Failed to load image:', shape.imageUrl);
                resolve(shape);
              };
            });
          }
          return shape;
        })
      );

      setShapes(processedShapes);
    };

    yShapes.observe(updateKonvaShapes);
    updateKonvaShapes();

    return () => {
      yShapes.unobserve(updateKonvaShapes);
    };
  }, [yDoc]);

  useEffect(() => {
    const handleAwarenessUpdate = () => {
      const states = awareness.getStates();
      const newCursors = {};
      states.forEach((state, clientId) => {
        if (state.cursor) {
          newCursors[clientId] = state.cursor;
        }
      });
      setCursors(newCursors);
    };

    awareness.on('change', handleAwarenessUpdate);

    return () => {
      awareness.off('change', handleAwarenessUpdate);
    };
  }, [awareness]);

  const updateCursor = (x, y) => {
    awareness.setLocalStateField('cursor', { x, y });
  };

  useImperativeHandle(ref, () => ({
    saveCanvas: async () => {
      const canvasData = { id: canvasId, team_id: teamId, canvas: JSON.stringify(shapes), title: title };
      try {
        const response = await createCanvas(canvasData);
        console.log("response", response);  
        console.log('Canvas saved successfully');
        return response.data;
      } catch (error) {
        console.error('Error saving canvas:', error);
      }
    }
  }));

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setScale(newScale);

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();

    onZoom(newScale);
  };

  const getCursorStyle = () => {
    switch (tool) {
      case 'mouse':
        return 'default';
      case 'pencil':
      case 'pen':
        return 'crosshair';
      case 'square':
      case 'circle':
        return 'crosshair';
      case 'text':
        return 'text';
      case 'eraser':
        return 'not-allowed';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) {
      const container = stage.container();
      container.style.cursor = getCursorStyle();
    }
  }, [tool]);

  useEffect(() => {
    if (transformerRef.current && selectedShapeIndex !== null) {
      const selectedNode = stageRef.current.findOne(`#shape-${selectedShapeIndex}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedShapeIndex]);

const handleMouseDown = (e) => {
  console.log('color', color);
  if (!tool || tool === 'mouse' || tool === 'eraser') return;
  setIsDrawing(true);
  const stage = e.target.getStage();
  const pointer = stage.getPointerPosition();
  const pos = {
    x: (pointer.x - position.x) / scale,
    y: (pointer.y - position.y) / scale,
  };

  if (tool === 'pencil' || tool === 'pen') {
    setCurrentShape({ tool, points: [pos.x, pos.y], color });
  } else if (tool === 'square' || tool === 'circle') {
    setCurrentShape({ tool, x: pos.x, y: pos.y, width: 0, height: 0, color });
  } else if (tool === 'text') {
    setCurrentShape({ tool, x: pos.x, y: pos.y, text: 'Sample Text', color });
  } else if (tool === 'image' && loadedImage) {
    setCurrentShape({
      tool: 'image',
      x: pos.x,
      y: pos.y,
      width: 0, 
      height: 0, 
      image: loadedImage, 
    });
  }
};

  const handleMouseMove = (e) => {
    const stage = e.target.getStage();
    const pointer = stage.getPointerPosition();
    const pos = {
      x: (pointer.x - position.x) / scale,
      y: (pointer.y - position.y) / scale,
    };

    updateCursor(pos.x, pos.y);

    if (!isDrawing || !tool) return;

    if (tool === 'pencil' || tool === 'pen') {
      const newPoints = currentShape.points.concat([pos.x, pos.y]);
      setCurrentShape({ ...currentShape, points: newPoints });
    } else if (tool === 'square') {
      const newWidth = pos.x - currentShape.x;
      const newHeight = pos.y - currentShape.y;
      setCurrentShape({ ...currentShape, width: newWidth, height: newHeight });
    } else if (tool === 'circle') {
      const radius = Math.sqrt(Math.pow(pos.x - currentShape.x, 2) + Math.pow(pos.y - currentShape.y, 2));
      setCurrentShape({ ...currentShape, radius });
    } else if (tool === 'image') {
      const newWidth = pos.x - currentShape.x;
      const newHeight = pos.y - currentShape.y;
      setCurrentShape({ ...currentShape, width: newWidth, height: newHeight });
    }
  };

  const handleMouseUp = async () => {
    if (!tool || tool.tool === 'mouse' || tool.tool === 'eraser') return;
    setIsDrawing(false);
    const newShape = { ...currentShape, id: `shape-${Date.now()}` };

    if (currentShape && currentShape.tool === 'image') {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.abs(currentShape.width);
        canvas.height = Math.abs(currentShape.height);
        const context = canvas.getContext('2d');
        context.drawImage(
          currentShape.image,
          0,
          0,
          Math.abs(currentShape.width),
          Math.abs(currentShape.height)
        );

        const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve));
        const file = new File([imageBlob], `image-${Date.now()}.png`, { type: 'image/png' });

        const uploadedImageUrl = await uploadImage(file, canvasId);

        const newImage = new window.Image();
        newImage.src = uploadedImageUrl;

        newImage.onload = () => {
          const newShape = {
            ...currentShape,
            id: `shape-${Date.now()}`,
            image: undefined,
            imageUrl: uploadedImageUrl,
          };
          setShapes([...shapes, newShape]);
          const yShapes = yDoc.getArray('shapes');
          yShapes.push([newShape]);
          setCurrentShape(null);
          console.log(shapes)
        };
  
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    } else {
      setShapes([...shapes, newShape]);
      const yShapes = yDoc.getArray('shapes');
      yShapes.push([newShape]);
    }
    setCurrentShape(null);
  };

  const handleTextDblClick = (e, index) => {
    const shape = shapes[index];
    setTextEditVisible(true);
    setTextEditValue(shape.text);
    setTextEditIndex(index);
  };

  const handleTextEditChange = (e) => {
    setTextEditValue(e.target.value);
  };

  const handleTextEditBlur = () => {
    console.log('Text edit blur', textEditIndex);
    const updatedShapes = shapes.map((shape, index) => {
      if (index === textEditIndex) {
        return { ...shape, text: textEditValue };
      }
      return shape;
    });
    setShapes(updatedShapes);
    setTextEditVisible(false);
    setTextEditValue('');
    setTextEditIndex(null);
  };

  const handleTextEditSubmit = () => {
    const updatedShapes = shapes.map((shape, idx) => {
      if (idx === textEditIndex) {
        return { ...shape, text: textEditValue };
      }
      return shape;
    });
    setShapes(updatedShapes);

    // Yjs 업데이트 (기존 도형을 삭제 후 새 도형 삽입)
    const yShapes = yDoc.getArray('shapes');
    yShapes.delete(textEditIndex, 1);
    yShapes.insert(textEditIndex, [{ ...shapes[textEditIndex], text: textEditValue }]);

    // 모달 닫기 및 상태 초기화
    setTextEditVisible(false);
    setTextEditIndex(null);
    setTextEditValue('');
  };  

  const handleShapeClick = (index) => {
    if (!tool) return;
    if (tool === 'eraser') {
      const updatedShapes = shapes.filter((_, i) => i !== index);
      setShapes(updatedShapes);

      const yShapes = yDoc.getArray('shapes');
      yShapes.delete(index, 1);
    } else {
      setSelectedShapeIndex(index);
    }
  };

  const handleDragEnd = (e, index) => {
    const updatedShape = {
      ...shapes[index],
      x: e.target.x(),
      y: e.target.y(),
    };

    const updatedShapes = shapes.map((shape, i) => (i === index ? updatedShape : shape));
    setShapes(updatedShapes);

    const yShapes = yDoc.getArray('shapes');
    yShapes.delete(index, 1);
    yShapes.insert(index, [updatedShape]);
  };

  const handleTransformEnd = (e, index) => {
    const node = e.target;
    const updatedShape = {
      ...shapes[index],
      x: node.x(),
      y: node.y(),
      width: node.width() * node.scaleX(),
      height: node.height() * node.scaleY(),
      scaleX: 1,
      scaleY: 1,
    };

    const updatedShapes = shapes.map((shape, i) => (i === index ? updatedShape : shape));
    setShapes(updatedShapes);

    const yShapes = yDoc.getArray('shapes');
    yShapes.delete(index, 1);
    yShapes.insert(index, [updatedShape]);
  };

  const saveCanvasAsJSON = async () => {
    const canvasData = { teamId, shapes };
    try {
      await createCanvas(canvasData);
      console.log('Canvas saved successfully');
    } catch (error) {
      console.error('Error saving canvas:', error);
    }
  };

const handleTextEditKeyDown = (e) => {
  if (e.key === 'Enter') {
    handleTextEditBlur(); // 엔터로 수정 반영
  }
};

  return (
    <>
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onWheel={handleWheel}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer ref={layerRef} width={canvasSize.width} height={canvasSize.height}>
          {shapes.map((shape, index) => {
            if (!shape || !shape.tool) return null;
            if (shape.tool === 'pencil' || shape.tool === 'pen') {
              return (
                <Line
                  key={index}
                  id={`shape-${index}`}
                  points={shape.points}
                  stroke={shape.color}
                  strokeWidth={shape.tool === 'pencil' ? 2 : 4}
                  onClick={() => handleShapeClick(index)}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, index)}
                />
              );
            } else if (shape.tool === 'square') {
              return (
                <Rect
                  key={index}
                  id={`shape-${index}`}
                  x={shape.x}
                  y={shape.y}
                  width={shape.width}
                  height={shape.height}
                  stroke={shape.color}
                  strokeWidth={2}
                  onClick={() => handleShapeClick(index)}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, index)}
                  onTransformEnd={(e) => handleTransformEnd(e, index)}
                />
              );
            } else if (shape.tool === 'circle') {
              return (
                <Circle
                  key={index}
                  id={`shape-${index}`}
                  x={shape.x}
                  y={shape.y}
                  radius={shape.radius}
                  stroke={shape.color}
                  strokeWidth={2}
                  onClick={() => handleShapeClick(index)}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, index)}
                  onTransformEnd={(e) => handleTransformEnd(e, index)}
                />
              );
            } else if (shape.tool === 'text') {
              return (
                <Text
                  key={index}
                  id={`shape-${index}`}
                  x={shape.x}
                  y={shape.y}
                  text={shape.text}
                  stroke={shape.color}
                  fontSize={20}
                  onDblClick={(e) => handleTextDblClick(e, index)}
                  onClick={() => handleShapeClick(index)}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, index)}
                  onTransformEnd={(e) => handleTransformEnd(e, index)}
                />
              );
            } else if (shape.tool === 'image') {
              return (
                <Image
                  key={index}
                  id={`shape-${index}`}
                  x={shape.x}
                  y={shape.y}
                  image={shape.image || loadedImage}
                  width={Math.abs(shape.width)}
                  height={Math.abs(shape.height)}
                  onClick={() => handleShapeClick(index)}
                  draggable
                  onDragEnd={(e) => handleDragEnd(e, index)}
                  onTransformEnd={(e) => handleTransformEnd(e, index)}
                />
              );
            }
            return null;
          })}
          {currentShape && (currentShape.tool === 'pencil' || currentShape.tool === 'pen') && (
            <Line points={currentShape.points} stroke="black" strokeWidth={currentShape.tool === 'pencil' ? 2 : 4} />
          )}
          {currentShape && currentShape.tool === 'square' && (
            <Rect x={currentShape.x} y={currentShape.y} width={currentShape.width} height={currentShape.height} stroke="black" strokeWidth={2} />
          )}
          {currentShape && currentShape.tool === 'circle' && (
            <Circle x={currentShape.x} y={currentShape.y} radius={currentShape.radius} stroke="black" strokeWidth={2} />
          )}
          {currentShape && currentShape.tool === 'text' && (
            <Text x={currentShape.x} y={currentShape.y} text={currentShape.text} fontSize={20} />
          )}
          {currentShape && currentShape.tool === 'image' && (
            <Image x={currentShape.x} y={currentShape.y} image={currentShape.image} width={currentShape.width} height={currentShape.height} />
          )}
          {Object.keys(cursors).map((clientId) => {
            const cursor = cursors[clientId];
            return (
              <Circle
                key={clientId}
                x={cursor.x}
                y={cursor.y}
                radius={5}
                fill="red"
                listening={false} // 이벤트를 받지 않도록 설정
              />
            );
          })}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
      {textEditVisible && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Edit Text</h3>
            <input
              type="text"
              value={textEditValue}
              onChange={(e) => setTextEditValue(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '16px' }}
            />
            <div style={{ marginTop: '10px', textAlign: 'right' }}>
              <button onClick={() => setTextEditVisible(false)} style={{ marginRight: '8px' }}>
                Cancel
              </button>
              <button onClick={handleTextEditSubmit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
};

const modalContentStyle = {
  background: '#fff',
  padding: '20px',
  borderRadius: '8px',
  width: '300px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
};

export default CanvasArea;