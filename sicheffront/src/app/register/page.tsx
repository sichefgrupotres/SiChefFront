import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 z-0 opacity-20 hidden md:block"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHVA0WzjNEO--QrKla0r2gJ95ImNM-zpFAf_eK-8gjtKAVyZ_ATWQJJbEC-kltmockGIubUpvin7gFk2MohOYm3jLctHF1P2um3x3e2te5hsF2kXJ3bH_tz39rptIqbLcHQqqUizfV88vHGcMUGdwn5eRx4YhFtIoXg88m9i6ubuJrKZPDRfuGF5wb8TNpFk-NxkbeUhF-WiHv0wCErH65VVV73yi9CJ8ujhvIon4b3-3g1m7GP7uhSsp6VhAm8nz-wBSCM4S1978')",
        }}
      />
      <div className="absolute inset-0 z-0 `bg-gradient-to-b` from-background-dark/90 to-background-dark hidden md:block" />

      <RegisterForm />
    </div>
  );
}