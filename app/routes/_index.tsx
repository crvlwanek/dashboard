import type { MetaFunction } from "@remix-run/node";
import Avatar from "~/components/Avatar";
import IconButton from "~/components/IconButton";

export const meta: MetaFunction = () => {
  return [
    { title: "Dashboard | Chris Van Lanen-Wanek" },
    { name: "description", content: "Welcome to my dashboard" },
  ];
};

const avatarImage =
  "https://scontent-msp1-1.xx.fbcdn.net/v/t39.30808-6/384752132_6783851961653044_4416593039952130129_n.jpg?stp=cp6_dst-jpg&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=9hPnm-v3vj4AX9Yfr6Q&_nc_ht=scontent-msp1-1.xx&oh=00_AfDnNaqr0qEcluXKtjS8Used6v7xfSnZ2YPeWioJrYEASg&oe=6554D885";

export default function Index() {
  return (
    <>
      <div className="flex align-center justify-center mainHeader">
        <div style={{ position: "relative" }}>
          <Avatar size={150} src={avatarImage} />
          <img
            src="https://i.imgur.com/xT9KhbJ.png"
            style={{ position: "absolute", height: 100, width: 100 }}
          />
        </div>
        <div className="detailBox onImage">
          <div className="header--container">
            <h1 className="header--name">Chris Van Lanen-Wanek</h1>
            <h2 className="header--jobTitle">
              Software Engineer | Web Developer
            </h2>
          </div>
          <div className="flex iconBox">
            <IconButton
              href="https://www.linkedin.com/in/crvlwanek/"
              iconKey="linkedIn"
            />
            <IconButton href="https://github.com/crvlwanek" iconKey="github" />
            <IconButton
              href="https://www.facebook.com/crvlwanek/"
              iconKey="facebook"
            />
            <IconButton
              href="https://www.instagram.com/crvlwanek/"
              iconKey="instagram"
            />
            <IconButton
              href="https://www.youtube.com/c/ChrisVLWanek"
              iconKey="youtube"
            />
          </div>
        </div>
      </div>
      <div style={{ height: "100vh" }}></div>
    </>
  );
}
