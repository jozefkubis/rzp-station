export default function Skeleton() {
  return (
    <section className="grid w-full animate-pulse grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="h-28 rounded-xl bg-slate-200" />
      ))}
    </section>
  );
}
