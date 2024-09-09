import './site.scss';
// import { render } from 'react-snapshot';
import { render } from 'react-dom';

import Menu from 'common/menu';
import GithubIcon from 'common/svgs/github.svg';
import ResumeIcon from 'common/svgs/resume.svg';
import NPMIcon from 'common/svgs/npm.svg';
import DiscordIcon from 'common/svgs/discord-circle.svg';
import EmailIcon from 'common/svgs/envelope-circle.svg';
import LinkedInIcon from 'common/svgs/linkedin.svg';
import MastodonIcon from 'common/svgs/mastodon.svg';

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
        title="GitHub"
        href="https://github.com/twipped"
        icon={<GithubIcon />}
        color="#24292f"
      />
      <Menu.Item
        title="npm"
        href="https://www.npmjs.com/~twipped"
        icon={<NPMIcon />}
        color="#CC3534"
      />
      <Menu.Item
        title="Discord"
        href="https://discord.gg/CKmKgfVST4"
        icon={<DiscordIcon />}
        color="#738ADB"
      />
      <Menu.Item
        title="Fediverse"
        href="https://twipped.social/@twipped"
        icon={<MastodonIcon />}
        color="#2b90d9"
        rel="me"
      />
    </Menu>
  </div>
);

const mountPoint = document.createElement('div');
document.body.appendChild(mountPoint);
render(<App />, mountPoint);
