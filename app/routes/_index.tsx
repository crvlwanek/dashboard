import type { MetaFunction } from "@remix-run/node";
import Avatar from "~/components/Avatar";
import IconButton from "~/components/IconButton";
import LinkedIn from "~/svg/LinkedIn";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Chris Van Lanen-Wanek" },
    { name: "description", content: "Welcome to my dashboard" },
  ];
};

const avatarImage = "https://scontent-msp1-1.xx.fbcdn.net/v/t39.30808-6/384752132_6783851961653044_4416593039952130129_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=9hPnm-v3vj4AX9Yfr6Q&_nc_ht=scontent-msp1-1.xx&oh=00_AfDnNaqr0qEcluXKtjS8Used6v7xfSnZ2YPeWioJrYEASg&oe=6554D885"

export default function Index() {
  return (
    <div className="flex-col align-center">
      <Avatar size={300} src={avatarImage}/>
      <h1>Chris Van Lanen-Wanek</h1>
      <h2>Software Enginer | Web Developer</h2>
      <div className="flex">
        <IconButton Icon={LinkedIn}/>
      </div>
    </div>
  );
}
