import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AiOutlineHome } from "react-icons/ai";
import MainHeader from "../../components/common/MainHeader";

const ErrorPage = ({
  openLoginModal,
  openLogoutModal,
  openAccountDeleteModal,
  openNicknameModal,
}) => {
  const [searchParams] = useSearchParams();
  const service = searchParams.get("service") || "Unknown";
  const navigate = useNavigate();

  return (
    <div>
      <MainHeader
        openLoginModal={openLoginModal}
        openLogoutModal={openLogoutModal}
        openAccountDeleteModal={openAccountDeleteModal}
        openNicknameModal={openNicknameModal}
      />
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-6xl font-bold" style={{ color: '#494e5e' }}>503</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mt-2">Service Unavailable</h2>
        <p className="text-gray-500 mt-2 text-center">
          {service !== "Unknown"
            ? `${service} 서비스가 현재 사용할 수 없습니다.`
            : "서버에서 문제가 발생했습니다."}
          <br />
          Please try again later or contact support if the issue persists.
        </p>

        <div className="mt-6">
          <img
            src="error.png"
            alt="Error Illustration"
            className="w-48 h-48"
          />
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition"
        >
          <AiOutlineHome size={18} />
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;