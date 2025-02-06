// src/hoc/withAuth.js
import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { userState } from '../recoil/UserAtoms';

const withAuth = (WrappedComponent, requiredRole = null, isTeamPage = false) => {
  return (props) => {
    const user = useRecoilValue(userState);
    const params = useParams();
    console.log("params:", params);
    const teamId = params.team_id || params.teamId;

    // Ensure teamId and user.teams are both integers for comparison
    const teamIdInt = parseInt(teamId, 10);
    const userTeamsInt = user.teams ? user.teams.map((id) => parseInt(id, 10)) : [];

    console.log("🔍 Checking Auth");
    console.log("User Info:", user);
    console.log("teamId:", teamIdInt);
    console.log("User Teams:", userTeamsInt);

    if (!user.isLogin) {
      return <Navigate to="/" replace />;
    }

    if (requiredRole === 'ADMIN' && user.role !== 'ADMIN') {
      return <Navigate to="/error" replace />;
    }

    if (isTeamPage && (!user.teams || !userTeamsInt.includes(teamIdInt))) {
      return <Navigate to="/error" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
