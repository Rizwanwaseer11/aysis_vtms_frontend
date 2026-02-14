import { ShieldCheck, Users, UserCheck } from "lucide-react";



const Management = () => {
  return (
    <div >
      <DashboardStats />
    </div>
  )
}

export default Management



 const DashboardStats = () => {
  const stats = [
    {
      title: "Management Users",
      value: 3,
      icon: <Users size={22} />,
      bg: "bg-orange-100",
      iconBg: "bg-orange-500",
    },
    {
      title: "Designations",
      value: 4,
      icon: <ShieldCheck size={22} />,
      bg: "bg-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      title: "Active Users",
      value: 2,
      icon: <UserCheck size={22} />,
      bg: "bg-green-100",
      iconBg: "bg-green-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 p-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-8 flex items-center justify-between shadow-md hover:shadow-lg  "
          >
            <div>
              <p className="text-gray-500 text-sm">{item.title}</p>
              <h2 className="text-2xl  mt-2">
                {item.value}
              </h2>
            </div>

            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl text-white ${item.iconBg}`}
            >
              {item.icon}
            </div>
          </div>
        ))}
      </div>
  );
}