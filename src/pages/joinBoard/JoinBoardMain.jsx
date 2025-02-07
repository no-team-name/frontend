import React, { useState, useEffect, useRef } from 'react';
import { getJoinBoardCard, searchJoinBoard, getJoinBoardCardByTitle } from '../../service/JoinBoardService';
import { Card, CardContent, Typography, Pagination, Container, Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import MainHeader from '../../components/common/MainHeader.jsx';
import './JoinBoardMain.css';

function JoinBoardMain({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
}) {
    const location = useLocation();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [sortOption, setSortOption] = useState('latest');
    const inputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSidebarToggle = (isOpen) => {
        console.log('Sidebar toggle:', isOpen);
        setIsSidebarOpen(isOpen);
    };

    const savePageState = (state) => {
        localStorage.setItem('joinBoardState', JSON.stringify(state));
    };

    const loadData = async (page, searchQuery = '', isSearching = false, sortOption = 'latest') => {
        setLoading(true);
        try {
            let response;
            if (isSearching) {
                response = await searchJoinBoard(searchQuery, page);
            } else {
                if (sortOption === 'title') {
                    response = await getJoinBoardCardByTitle(page);
                } else {
                    response = await getJoinBoardCard(page);
                }
            }

            if (response && response.data && response.data.data) {
                setPosts(response.data.data.content);
                setTotalPages(response.data.data.totalPages);
            } else {
                setPosts([]);
                setTotalPages(0);
            }
        } catch (error) {
            console.error('데이터 로드 중 오류:', error);
            setPosts([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const savedState = localStorage.getItem('joinBoardState');

        if (savedState) {
            const parsedState = JSON.parse(savedState);

            setCurrentPage(parsedState.currentPage || 1);
            setSortOption(parsedState.sortOption || 'latest');
            setSearchQuery(parsedState.searchQuery || '');
            setIsSearching(parsedState.isSearching || false);

            loadData(
                parsedState.currentPage - 1,
                parsedState.searchQuery,
                parsedState.isSearching,
                parsedState.sortOption
            );
        } else {
            loadData(0);
        }
    }, []);

    // 상태 변경 시 localStorage 업데이트
    useEffect(() => {
        savePageState({
            currentPage,
            sortOption,
            searchQuery,
            isSearching
        });
    }, [currentPage, sortOption, searchQuery, isSearching]);

    // 페이지 또는 검색/정렬 조건 변경 시 데이터 다시 로드
    useEffect(() => {
        loadData(currentPage - 1, searchQuery, isSearching, sortOption);
    }, [currentPage, isSearching, sortOption]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (!searchQuery) return;

        setIsSearching(true);
        setCurrentPage(1);
        loadData(0, searchQuery, true);
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleCardClick = (id) => {
        navigate(`/join-board/${id}`);
    };

    const homeClick = () => {
        setIsSearching(false);
        setSearchQuery('');
        setCurrentPage(1);
        setSortOption('latest');
        loadData(0);
        localStorage.removeItem('joinBoardState');
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
        setCurrentPage(1);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
        <div className={`board-container`}>
            <MainHeader
                logoSrc="/path/to/your/logo.png"
                openLoginModal={openLoginModal}
                openLogoutModal={openLogoutModal}
                openAccountDeleteModal={openAccountDeleteModal}
                openNicknameModal={openNicknameModal}
                onSidebarToggle={handleSidebarToggle}
            />
            <div className={`board-container ${isSidebarOpen ? 'ml-64' : ''}`}>

            <Container maxWidth="lg" style={{padding: '20px'}}>
                <br/>
                <Typography variant="h3" component="div" align="center"
                            style={{fontWeight: 'bold', marginBottom: '20px', color: 'black'}}>
                    <span className="home-title" onClick={homeClick}>Join Board</span>
                </Typography>

                <br/>

                <div className="search"
                    style={{
                        maxWidth: '900px',
                        margin: '0 auto 0',
                        justifyContent: 'right'
                    }}
                >
                <Button
                    className="create-post-button"
                    variant="contained"
                    color="black"
                    onClick={() => navigate('/create-join-board')}
                >
                    글 작성
                </Button>
                </div>

                <br/>

                <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '900px',
                    margin: '0 auto 20px',
                }}
                >
                <FormControl variant="outlined" style={{ minWidth: '120px', marginTop: '10px' }}>
                    <InputLabel>정렬</InputLabel>
                    <Select value={sortOption} onChange={handleSortChange} label="정렬">
                    <MenuItem value="title">제목순</MenuItem>
                    <MenuItem value="latest">최신순</MenuItem>
                    </Select>
                </FormControl>
                <form onSubmit={handleSearchSubmit} style={{display: 'flex', gap: '10px'}}>
                        <input
                            ref={inputRef}
                            className="search-input"
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{maxWidth:'150px'}}
                        />
                        <button className="search-button" type="submit">검색</button>
                    </form>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                    {posts.map(post => (
                        <Card
                            className="card"
                            key={post.id}
                            style={{
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                padding: '20px',
                                width: '100%',
                                maxWidth: '900px',
                                margin: '0 auto',
                                borderRadius: '10px'
                            }}
                            onClick={() => handleCardClick(post.id)}
                        >
                            <CardContent className='card-content' style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start'}}>
                                {/* 기존 카드 내용 그대로 유지 */}
                                <Box style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    marginRight: '20px',
                                    height: '85px',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{
                                        width: '55px',
                                        height: '55px',
                                        borderRadius: '50%',
                                        overflow: 'hidden'
                                    }}>
                                        <img
                                            src={post.memberProfileUrl || 'https://www.cheonyu.com/_DATA/product/63900/63992_1672648178.jpg'}
                                            alt={post.memberNickname}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                aspectRatio: '1/1',
                                                borderRadius: '50%'
                                            }}
                                        />
                                    </div>
                                    <Typography variant="body2" color="text.secondary" style={{marginBottom: '5px'}}>
                                        {post.memberNickname}
                                    </Typography>
                                </Box>

                                {/* 본문 섹션 */}
                                <Box style={{flex: 1}}>
                                    <Typography variant="h5" component="div"
                                                style={{fontWeight: 'bold', marginBottom: '10px'}}>
                                        {post.title}

                                        <Typography variant="body2" color="text.secondary"
                                                    style={{marginBottom: '5px'}}>
                                            {post.createdAt}
                                        </Typography>
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#a6a6a6',
                                            marginBottom: '10px',
                                            boxSizing: 'border-box',
                                            paddingBottom: '0px'
                                        }}
                                    >
                                        <strong>주제</strong>
                                        <span style={{ fontWeight: 'bold', marginLeft: '10px', color: '#595959' }}>{post.topic}</span>
                                    </Typography>


                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#a6a6a6',
                                            marginBottom: '10px',
                                            boxSizing: 'border-box',
                                            paddingTop: '0px',
                                            paddingBottom: '0px'
                                        }}
                                    >
                                        <strong>팀 이름</strong>
                                        <span style={{
                                            fontWeight: 'bold',
                                            marginLeft: '10px',
                                            color: '#595959'
                                        }}>{post.teamName}</span>
                                    </Typography>


                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#a6a6a6',
                                            marginTop: '10px',
                                            boxSizing: 'border-box',
                                            paddingTop: '0px',
                                            paddingBottom: '0px'
                                        }}
                                    >
                                        <strong>소개글</strong>
                                        <span style={{
                                            fontWeight: 'bold',
                                            marginLeft: '10px',
                                            color: '#595959'
                                        }}>{post.projectBio}</span>
                                    </Typography>


                                </Box>

                                {/* 날짜 및 인원 섹션 */}
                                <Box style={{textAlign: 'right', paddingRight: '20px'}}>
                                    <Typography variant="body2" color="text.secondary"
                                                style={{marginBottom: '5px', boxSizing: 'border-box', paddingBottom: '3px'}}>
                                        <strong>시작일</strong> {new Date(post.startDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary"
                                                style={{marginBottom: '5px', boxSizing: 'border-box', paddingTop: '0px', paddingBottom: '2px'}}>
                                        <strong>종료일</strong> {new Date(post.endDate).toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary"
                                                style={{marginBottom: '5px', boxSizing: 'border-box', paddingTop: '75px'}}>
                                        <strong>현재 인원</strong> {post.peopleNumber} / 4
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* 페이지네이션 섹션 */}
                <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        size="large"
                        sx={{
                            "& .MuiPaginationItem-root": {
                                backgroundColor: "white",
                                color: "black",
                                borderRadius: '50%',
                                "&:hover": {
                                    backgroundColor: "lightgray",
                                    color: "black",
                                },
                            },
                            "& .MuiPaginationItem-root.selected": {
                                backgroundColor: "gray !important",
                                color: "white !important",
                                fontWeight: 'bold',
                                borderRadius: '50%',
                            },
                            "& .MuiPaginationItem-previousNext": {
                                backgroundColor: "transparent",
                                color: "black",
                            },
                        }}
                    />
                </div>
            
            </Container>
            </div>
            </div>
        </>
    );
}

export default JoinBoardMain;