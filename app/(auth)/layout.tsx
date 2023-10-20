export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className=" h-full w-full flex flex-col justify-center items-center mt-32">
          {children}
      </div>
    )
  }