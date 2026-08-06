function SummaryCard({
  title,
  value,
  icon,
  color,
  subtitle,
}) {
  return (
    <div
      className="
group
rounded-3xl
border
border-gray-100
bg-white
p-6
shadow-sm
transition-all
duration-300
hover:-translate-y-1
hover:shadow-xl
"
    >

      <div
  className={`
    w-16
    h-16
    rounded-2xl
    flex
    items-center
    justify-center
    text-3xl
    mb-6
    transition-transform
    duration-300
    group-hover:scale-110
    ${color}
  `}
> 
        {icon}
      </div>

      <p className="text-4xl font-bold text-slate-900">
  {value}
</p>

<h3 className="mt-2 text-sm font-medium text-gray-500">
  {title}
</h3>

    </div>
  );
}

export default SummaryCard;