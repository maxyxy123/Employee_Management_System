// components/common/AppLoading.tsx

type AppLoadingProps = {
  text?: string;
  fullScreen?: boolean;
};

export function AppLoading({
  text = "Đang tải dữ liệu...",
  fullScreen = false,
}: AppLoadingProps) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-screen items-center justify-center"
          : "flex min-h-[200px] items-center justify-center"
      }
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

        <p className="text-sm font-medium text-gray-500">{text}</p>
      </div>
    </div>
  );
}