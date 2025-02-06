// src/hoc/WithAuthComponent.js
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/UserAtoms';

const WithAuthComponent = ({ component: Component, requiredRole = null, isTeamPage = false, ...props }) => {
  const user = useRecoilValue(userState);
  const params = useParams();
  console.log("params:", params);
  
  const teamId = params.team_id || params.teamId;
  const teamIdInt = teamId ? parseInt(teamId, 10) : null;
  const userTeamsInt = user.teams ? user.teams.map((id) => parseInt(id, 10)) : [];

  console.log("🔍 Checking Auth");
  console.log("User Info:", user);
  console.log("teamId:", teamIdInt);
  console.log("User Teams:", userTeamsInt);

  if (!user.isLogin) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  if (isTeamPage && (!user.teams || !userTeamsInt.includes(teamIdInt))) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Component {...props} />;
};

export default WithAuthComponent;
