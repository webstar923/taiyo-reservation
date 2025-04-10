'use client';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="auth relative flex flex-col bg-cover bg-no-repeat sm:flex-row">
      <div className="w-full h-auto inset-0 flex flex-col justify-center items-center mx-auto">
        {...[children]}
      </div>
    </div>
  );
};

export default MainLayout;
