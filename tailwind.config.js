module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // corePlugins: {
  //   preflight: false, // Tailwind 기본 스타일 초기화 비활성화
  // },
  theme: {
    extend: {
      colors: {
        "mainBackgroundColor": '#ffffff',
        "columnBackgroundColor": '#edf7ff',
        "columnBorderColor": '#bde3ff',
        "columnColor": '#0d99ff',
        "customGray": '#F3F4F6'
      }
    },
  },
  plugins: [],
};
