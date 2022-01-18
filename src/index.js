import './site.scss';
// import { render } from 'react-snapshot';
import { render } from 'react-dom';

import Menu from 'common/menu';
import GithubIcon from 'common/svgs/github.svg';
import TwitterIcon from 'common/svgs/twitter-circle.svg';
import ResumeIcon from 'common/svgs/resume.svg';
import NPMIcon from 'common/svgs/npm.svg';
import FacebookIcon from 'common/svgs/facebook.svg';
import KofiIcon from 'common/svgs/ko-fi-colored.svg';
import PatreonIcon from 'common/svgs/patreon-circle.svg';
import DiscordIcon from 'common/svgs/discord-circle.svg';
import EmailIcon from 'common/svgs/envelope-circle.svg';
import LinkedInIcon from 'common/svgs/linkedin.svg';

const App = () => (
  <div>
    <Menu center={<img src="/images/twipped.png" />}>
      <Menu.Item
        title="Resume"
        href="/resume.html"
        icon={<ResumeIcon />}
        color="var(--bs-accent)"
      />
      <Menu.Item
        title="LinkedIn"
        href="https://www.linkedin.com/in/jocelyn-badgley/"
        icon={<LinkedInIcon />}
        color="#0a66c2"
      />
      <Menu.Item
        title="Email"
        href="mailto:media@twipped.com"
        icon={<EmailIcon />}
        color="var(--bs-success)"
      />
      <Menu.Item
        title="Discord"
        href="https://discord.gg/CKmKgfVST4"
        icon={<DiscordIcon />}
        color="#738ADB"
      />
      <Menu.Item
        title="GitHub"
        href="https://github.com/twipped"
        icon={<GithubIcon />}
        color="#24292f"
      />
      <Menu.Item
        title="npm"
        href="https://www.npmjs.com/~chipersoft"
        icon={<NPMIcon />}
        color="#CC3534"
      />
      <Menu.Item
        title="Twitter"
        href="https://www.twitter.com/TwippedTech"
        icon={<TwitterIcon />}
        color="#1DA1F2"
      />
      <Menu.Item
        title="Facebook"
        href="https://www.facebook.com/Twipped/"
        icon={<FacebookIcon />}
        color="#3b5998"
      />
      <Menu.Item
        title="Ko-Fi"
        href="https://ko-fi.com/curvyandtrans"
        icon={<KofiIcon />}
        color="#00B9FE"
      />
      <Menu.Item
        title="Patreon"
        href="https://patreon.com/curvyandtrans"
        icon={<PatreonIcon />}
        color="#ff424d"
      />
    </Menu>
  </div>
);

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
render(<App />, mountPoint);
