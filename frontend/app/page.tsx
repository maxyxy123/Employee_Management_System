import Link from "next/link";

const features = [
  {
    title: "Quản lý nhân sự",
    description:
      "Theo dõi thông tin nhân viên, phòng ban, chức vụ, trạng thái làm việc và hồ sơ cá nhân tập trung.",
  },
  {
    title: "Quản lý nghỉ phép",
    description:
      "Tạo đơn nghỉ phép, duyệt đơn, theo dõi số ngày nghỉ và lịch sử xử lý minh bạch.",
  },
  {
    title: "Phân quyền hệ thống",
    description:
      "Hỗ trợ phân quyền Admin, HR, Manager và Employee theo đúng trách nhiệm sử dụng.",
  },
  {
    title: "Báo cáo & thống kê",
    description:
      "Tổng hợp dữ liệu nhân sự, nghỉ phép, phòng ban và hoạt động quản lý nhanh chóng.",
  },
];

const stats = [
  {
    value: "100%",
    label: "Quản lý tập trung",
  },
  {
    value: "4+",
    label: "Vai trò người dùng",
  },
  {
    value: "24/7",
    label: "Truy cập hệ thống",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            EMS<span className="text-blue-400">.</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">
              Tính năng
            </a>
            <a href="#workflow" className="hover:text-white">
              Quy trình
            </a>
            <a href="#roles" className="hover:text-white">
              Phân quyền
            </a>
          </nav>

          <Link
            href="/login"
            className="rounded-full bg-blue-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
          >
            Đăng nhập
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 lg:grid-cols-2 lg:py-32">
          <div>
            <div className="mb-6 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-4 py-2 text-sm text-blue-300">
              Employment Management System
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Quản lý nhân sự hiện đại, minh bạch và hiệu quả
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              EMS giúp doanh nghiệp quản lý nhân viên, phòng ban, nghỉ phép,
              phân quyền và báo cáo trên một nền tảng thống nhất, hỗ trợ tổ chức
              vận hành khoa học và bảo vệ quyền lợi người lao động.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/login"
                className="rounded-full bg-blue-500 px-8 py-3 text-center font-semibold text-white transition hover:bg-blue-600"
              >
                Bắt đầu sử dụng
              </Link>

              <a
                href="#features"
                className="rounded-full border border-white/15 px-8 py-3 text-center font-semibold text-white transition hover:bg-white/10"
              >
                Xem tính năng
              </a>
            </div>
          </div>

          {/* Hero Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="rounded-2xl bg-slate-900 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Dashboard</p>
                  <h3 className="text-2xl font-bold">Employee Overview</h3>
                </div>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-400">
                  Active
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-3xl font-bold text-blue-400">
                      {item.value}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                {[
                  "Nguyễn Văn A - HR Manager",
                  "Trần Thị B - Frontend Developer",
                  "Lê Văn C - Backend Developer",
                ].map((name) => (
                  <div
                    key={name}
                    className="flex items-center justify-between rounded-2xl bg-slate-800 p-4"
                  >
                    <div>
                      <p className="font-medium">{name}</p>
                      <p className="text-sm text-slate-400">Đang làm việc</p>
                    </div>
                    <span className="rounded-full bg-blue-500/15 px-3 py-1 text-sm text-blue-300">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Tính năng chính
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight">
            Một hệ thống cho toàn bộ quy trình quản lý nhân sự
          </h2>
          <p className="mt-4 text-slate-300">
            Thiết kế theo hướng rõ trách nhiệm, dễ sử dụng và phù hợp với mô
            hình quản trị doanh nghiệp hiện đại.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:bg-white/10"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-xl font-bold text-blue-400">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                Quy trình vận hành
              </p>
              <h2 className="mt-3 text-4xl font-bold">
                Từ dữ liệu nhân sự đến quyết định quản lý
              </h2>
              <p className="mt-5 leading-8 text-slate-300">
                EMS giúp chuẩn hóa dữ liệu, giảm xử lý thủ công, hạn chế sai sót
                và tăng tính minh bạch trong quản lý lao động.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "HR tạo và cập nhật hồ sơ nhân viên",
                "Manager theo dõi nhân sự thuộc phòng ban",
                "Employee gửi đơn nghỉ phép trên hệ thống",
                "Admin quản lý phân quyền và cấu hình hệ thống",
              ].map((step, index) => (
                <div
                  key={step}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-slate-900 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="pt-2 text-slate-200">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section id="roles" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
            Phân quyền
          </p>
          <h2 className="mt-3 text-4xl font-bold">
            Mỗi vai trò, đúng quyền hạn
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-4">
          {["Admin", "HR", "Manager", "Employee"].map((role) => (
            <div
              key={role}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/15 text-xl font-bold text-blue-400">
                {role.charAt(0)}
              </div>
              <h3 className="text-xl font-bold">{role}</h3>
              <p className="mt-3 text-sm text-slate-400">
                Truy cập chức năng phù hợp với nhiệm vụ được phân công.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-center shadow-2xl md:p-16">
          <h2 className="text-4xl font-bold text-white">
            Sẵn sàng quản lý nhân sự chuyên nghiệp hơn?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-blue-50">
            Bắt đầu với EMS để xây dựng môi trường làm việc rõ ràng, minh bạch
            và hiệu quả.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-3 font-semibold text-blue-600 transition hover:bg-slate-100"
          >
            Đi tới đăng nhập
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 md:flex-row">
          <p>© 2026 EMS. Employment Management System.</p>
          <p>Built with Next.js, TypeScript, NestJS & Prisma.</p>
        </div>
      </footer>
    </main>
  );
}