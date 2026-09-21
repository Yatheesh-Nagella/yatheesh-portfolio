export const metadata = {
  title: 'Self-Hosting a Full-Stack App on a Raspberry Pi 5 | Yatheesh Nagella',
  description:
    'My first home lab project: a React, FastAPI and Postgres recipe box on a Raspberry Pi 5, reached over Tailscale. The stack choices, and the real bugs (Docker networking, race conditions, accidental LAN exposure) that taught me the most.',
  keywords: [
    'raspberry pi 5',
    'home lab',
    'self-hosting',
    'tailscale',
    'caddy reverse proxy',
    'docker compose networking',
    'fastapi',
    'postgres docker healthcheck',
  ],
  authors: [{ name: 'Yatheesh Nagella' }],
  openGraph: {
    title: 'Self-Hosting a Full-Stack App on a Raspberry Pi 5',
    description:
      'A beginner’s real home lab journey: the stack, the bugs, and what they taught me.',
    url: 'https://yatheeshnagella.com/blogs/raspberry-pi-home-lab',
    siteName: 'Yatheesh Nagella Portfolio',
    locale: 'en_US',
    type: 'article',
  },
  category: 'Home Lab',
};

function Code({ children, label }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden shadow-md">
      {label && (
        <div className="bg-gray-800 text-gray-300 text-xs font-mono px-4 py-2 border-b border-gray-700">
          {label}
        </div>
      )}
      <pre className="bg-gray-900 text-gray-100 text-sm p-4 overflow-x-auto leading-relaxed">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Callout({ tone = 'cyan', title, children }) {
  const tones = {
    cyan: 'from-cyan-50 to-blue-50 border-cyan-500',
    orange: 'from-orange-50 to-yellow-50 border-orange-500',
    red: 'from-red-50 to-pink-50 border-red-500',
  };
  return (
    <div className={`bg-gradient-to-r ${tones[tone]} border-l-4 p-6 rounded-r-lg my-8`}>
      {title && <p className="font-bold text-gray-900 mb-2">{title}</p>}
      <div className="text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

function H2({ children }) {
  return <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-4">{children}</h2>;
}

function H3({ children }) {
  return <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-3">{children}</h3>;
}

function P({ children }) {
  return <p className="text-gray-700 leading-relaxed mb-4">{children}</p>;
}

function Ic({ children }) {
  return (
    <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded text-[0.9em] font-mono">
      {children}
    </code>
  );
}

export default function RaspberryPiHomeLabPost() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a
              href="/blogs"
              className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              <span>←</span> Back to Blog
            </a>
            <a
              href="/"
              className="text-gray-600 hover:text-orange-500 font-semibold transition-colors"
            >
              Return Home
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article>
          <header className="mb-10">
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold inline-block mb-4">
              NEW
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
              Self-Hosting a Full-Stack App on a Raspberry Pi 5: The Bugs Taught Me More Than the Setup
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-600 text-sm md:text-base">
              <span className="font-medium">By Yatheesh Nagella</span>
              <span>•</span>
              <span>September 2026</span>
              <span>•</span>
              <span>12 min read</span>
            </div>
          </header>

          <div className="max-w-none">
            <P>
              I want to build a proper home lab eventually: a PC-based machine with real
              storage, real networking, and room to break things. But I didn’t want to spend
              that money before I understood what I was buying hardware for. So I started with
              one Raspberry Pi 5 and a small, real project to force me to learn the
              infrastructure side by hand.
            </P>
            <P>
              The project is a self-hosted recipe box: a React frontend, a FastAPI backend and
              a Postgres database. I save cooking videos from YouTube (a lot of them regional
              and Indian-language), tag them by cuisine and ingredients, and keep a running log
              of how I changed the recipe each time I cooked it.
            </P>
            <P>
              This isn’t a polished tutorial. It’s the honest version: why I picked each
              piece, and the bugs that cost me evenings. If you’re a beginner, the bugs are
              the useful part, because that’s where most people get stuck.
            </P>

            <H2>Why self-host at all?</H2>
            <P>
              A hosted platform would have gotten this app online faster. But then I’d have
              learned how to click through a dashboard, not how networks, containers and
              reverse proxies fit together. Constraints help here: a small ARM board, one
              user, and no budget for mistakes means every decision has to be justified.
            </P>

            <H2>The stack, and why each piece</H2>

            <H3>1. Remote access: Tailscale, not port forwarding</H3>
            <P>I looked at three ways to reach the Pi from outside my house:</P>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>Port forwarding plus dynamic DNS</li>
              <li>Cloudflare Tunnel</li>
              <li>Tailscale, a mesh VPN</li>
            </ul>
            <P>
              I chose Tailscale for three reasons. Only I need access, so there’s no reason
              to be public. It needs zero exposed ports, so there’s no attack surface on my
              home network. And it works behind CGNAT, which matters because most home ISPs
              no longer hand out a usable public IP.
            </P>
            <P>
              I deliberately deferred Cloudflare Tunnel. It becomes the right add-on later,
              but only if a specific app has to be reachable by people who won’t install
              Tailscale.
            </P>

            <H3>2. Reverse proxy: Caddy, with Nginx on the “learn later” list</H3>
            <P>
              A reverse proxy sits in front of your apps and routes incoming requests to the
              right one. I picked Caddy because it’s a friendly first encounter with the
              concept: automatic HTTPS, a much shorter config syntax, and zero-downtime
              reloads. Nginx is the more common industry standard and I do want to learn it,
              but I picked Caddy for a good first experience with the idea, not as a
              permanent verdict.
            </P>

            <H3>3. Everything in Docker, one container per service</H3>
            <P>
              Caddy, Postgres, the FastAPI backend and eventually the React frontend each get
              their own container. Nothing is installed on the Pi’s OS directly. That gives
              me isolation (one app’s dependencies can’t break another’s), easy rebuilds, and
              a setup that looks like real-world infrastructure rather than a toy.
            </P>

            <H3>4. Backend: FastAPI over Flask or Django</H3>
            <P>
              FastAPI has a lighter footprint, which matters on Pi-class hardware. It also
              generates interactive API docs at <Ic>/docs</Ic>, validates requests through
              Pydantic, and supports async. Django’s admin and ORM felt like overhead I didn’t
              need yet. Flask is close, but lacks the automatic docs and validation.
            </P>

            <H3>5. Routing multiple apps: paths, not subdomains</H3>
            <P>
              Tailscale gives you one hostname per device, not free subdomains per app. So
              when I host a second app on the same Pi, Caddy will route by path (
              <Ic>/recipe-box</Ic>, <Ic>/app2</Ic>) instead of by subdomain. That avoids
              needing a separate Tailscale identity for every app.
            </P>

            <H2>The bugs (where the learning happened)</H2>

            <H3>Bug 1: two passwords that should have been one</H3>
            <P>
              The backend couldn’t log in to Postgres. My <Ic>.env</Ic> file had this:
            </P>
            <Code label=".env (broken)">{`POSTGRES_PASSWORD=Changing@me
DATABASE_URL=postgresql://recipes:changeme@postgres:5432/recipes`}</Code>
            <P>
              The <Ic>DATABASE_URL</Ic> was hardcoded separately and still held the old
              placeholder. Postgres was initialised with one password and the backend was
              trying another. The fix was to make them agree.
            </P>
            <P>
              There was a second lesson hiding in there. The <Ic>@</Ic> in a password breaks
              URL parsing, because <Ic>@</Ic> is the separator between credentials and host.
              You either percent-encode it (<Ic>%40</Ic>) or, more simply, avoid it. I
              avoided it.
            </P>

            <H3>Bug 2: the 502 Bad Gateway and the meaning of “localhost”</H3>
            <P>
              This one taught me the most. Caddy returned <Ic>502 Bad Gateway</Ic> for
              every request, and my config looked correct:
            </P>
            <Code label="Caddyfile (broken)">{`:80 {
    reverse_proxy localhost:8000
}`}</Code>
            <P>
              The problem is that <Ic>localhost</Ic> inside a container means that
              container itself. It isn’t the Pi, and it isn’t the container next door. Caddy
              was dutifully looking for a backend on port 8000 inside the Caddy container,
              where nothing lives.
            </P>
            <P>
              Fixing that alone wasn’t enough, and I found the real root cause with{' '}
              <Ic>docker network ls</Ic> and <Ic>docker inspect</Ic>. Caddy and the backend
              had been created by two separate <Ic>docker-compose.yml</Ic> files in two
              separate folders. Compose had quietly created two completely isolated networks,
              with no path between them.
            </P>
            <P>
              The fix has two parts. Join the backend to Caddy’s network as an external
              network, then address it by service name instead of <Ic>localhost</Ic>.
            </P>
            <Code label="backend/docker-compose.yml">{`services:
  backend:
    # ...
    networks:
      - caddy_default

networks:
  caddy_default:
    external: true   # created by the other compose project`}</Code>
            <Code label="Caddyfile (fixed)">{`:80 {
    reverse_proxy backend:8000
}`}</Code>
            <Callout tone="cyan" title="The mental model to keep">
              Containers are isolated by default. Networks are the bridges between them. On a
              shared network, Docker’s built-in DNS lets containers find each other by service
              name, so <Ic>backend:8000</Ic> works and <Ic>localhost:8000</Ic> can’t.
            </Callout>

            <H3>Bug 3: the backend that crashed on first boot</H3>
            <P>
              Every so often the backend died on startup, then worked fine on a restart. I
              had <Ic>depends_on: postgres</Ic>, so I assumed the ordering was handled. It
              isn’t. <Ic>depends_on</Ic> only waits for the container to start, not for
              Postgres to be ready to accept connections. Those can be several seconds apart.
            </P>
            <P>
              The fix is a real healthcheck, and telling Compose to wait for it:
            </P>
            <Code label="docker-compose.yml">{`services:
  postgres:
    image: postgres:16
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U recipes"]
      interval: 5s
      timeout: 3s
      retries: 10

  backend:
    depends_on:
      postgres:
        condition: service_healthy`}</Code>

            <H3>Bug 4: accidentally exposing the app to my whole LAN</H3>
            <P>
              Caddy was published on <Ic>0.0.0.0:80</Ic>. Nothing was on the public internet,
              but anyone on my home WiFi could reach the app directly without going through
              Tailscale. That’s wider than I intended. Since Tailscale Serve reaches Caddy
              through the Pi’s own loopback anyway, I bound the port to loopback only:
            </P>
            <Code label="caddy/docker-compose.yml">{`ports:
  - "127.0.0.1:80:80"   # was "80:80", i.e. 0.0.0.0`}</Code>

            <H3>Bug 5 (sort of): the red LED and the unresponsive Pi</H3>
            <P>
              One day SSH timed out and the Pi showed a red light. I power-cycled it and it
              came back cleanly. I never found a definitive root cause: rebooting clears the
              undervoltage history flag, so the evidence was gone. The likeliest suspects are
              a marginal power supply or cable (the Pi 5 draws more than earlier models) or
              a transient kernel or filesystem hang.
            </P>
            <P>
              I can’t claim I solved this one. What it did was turn “I should think about
              disaster recovery” from an abstract idea into a task for this week.
            </P>

            <H2>Reproducibility: if the SD card died tomorrow</H2>
            <P>
              The recipe box code was in a private GitHub repo from day one. But my Caddy
              config existed only on the Pi’s SD card, committed nowhere. If the card failed,
              the reverse proxy setup would be gone with no record of it. I turned{' '}
              <Ic>~/caddy</Ic> into its own git repo, with a <Ic>.gitignore</Ic> that
              excludes Docker’s generated <Ic>data/</Ic> and <Ic>config/</Ic> folders.
              That’s TLS state and runtime data that regenerates automatically and doesn’t
              belong in version control.
            </P>
            <P>
              Secrets are the exception. <Ic>.env</Ic> files stay out of git in both repos,
              and the plan is to keep them in a password manager.
            </P>

            <H2>Backups: two different risks</H2>
            <P>
              I separated the risks, because they need different answers: losing the{' '}
              <em>data</em> in the database, and losing the whole <em>setup</em>. The git
              repos cover the second. For the first, the plan is:
            </P>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
              <li>A nightly <Ic>pg_dump</Ic> from cron.</li>
              <li>
                Copy the dump <em>off</em> the Pi with rclone or rsync, to cloud storage or
                another device. A backup on the same SD card isn’t a backup.
              </li>
              <li>
                Test restores periodically, since an untested backup isn’t a real backup.
              </li>
              <li>
                Longer term, move from the SD card to a USB SSD. That doesn’t replace
                backups; it just lowers how often I’d need one.
              </li>
            </ul>

            <H2>In progress: CI/CD</H2>
            <P>
              I’m adding pytest for the backend using FastAPI’s <Ic>TestClient</Ic>, and I’m
              considering in-memory SQLite for fast test runs instead of hitting real
              Postgres. For deployment I’m going with a self-hosted GitHub Actions runner on
              the Pi itself, rather than a GitHub-hosted runner reaching in over Tailscale.
              It matches the “Pi pulls from GitHub” pattern I already use, and it needs no
              inbound exposure, since the Pi only makes outbound connections to GitHub.
            </P>

            <H2>What’s next: importing recipes from YouTube</H2>
            <P>
              This isn’t built yet, so treat it as the plan. Paste a YouTube link, pull the
              transcript with the YouTube transcript API (or Whisper for videos without
              captions), and have an LLM extract a structured recipe: ingredients with
              quantities, and steps.
            </P>
            <P>
              The interesting part is regional cooking videos in Hindi, Tamil, Telugu, or
              code-switched Hindi-English. Whisper handles these reasonably well, and an LLM
              can extract structure directly from non-English or mixed-language transcripts
              without a separate translation step. The harder problem is informal measurement
              like <em>ek katori</em> or <em>chutki bhar namak</em>. Rather than force false
              precision, I plan to keep the original phrasing alongside a best-effort
              standard-unit estimate.
            </P>

            <H2>What I’d tell another beginner</H2>
            <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-4">
              <li>
                <strong>Containers are isolated by default.</strong> When two containers
                can’t talk, check the networks before the config.
              </li>
              <li>
                <strong>Started isn’t ready.</strong> Use healthchecks, not just{' '}
                <Ic>depends_on</Ic>.
              </li>
              <li>
                <strong>Check what you’re actually listening on.</strong>{' '}
                <Ic>0.0.0.0</Ic> versus <Ic>127.0.0.1</Ic> is the difference between “my LAN”
                and “only me”.
              </li>
              <li>
                <strong>Config that lives on one SD card is a risk.</strong> Commit it, and
                keep secrets out of the commit.
              </li>
              <li>
                <strong>Back up off the device, and test the restore.</strong>
              </li>
            </ul>
            <P>
              Next up: the backups, the CI runner, and a USB SSD. I’ll write those up too.
            </P>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                Raspberry Pi
              </span>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                Home Lab
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                Docker
              </span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                Networking
              </span>
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold">
                Personal Story
              </span>
            </div>
          </div>
        </article>

        <div className="mt-12 bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 flex-shrink-0 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
              YN
            </div>
            <div>
              <h4 className="text-xl font-black text-gray-900 mb-1">Yatheesh Nagella</h4>
              <p className="text-gray-600 mb-4">
                Software Engineer & Cloud Solutions Consultant specializing in multi-cloud
                architecture, DevOps automation, and scalable systems.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://linkedin.com/in/Yatheesh-Nagella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://github.com/Yatheesh-Nagella"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="mailto:yatheeshnagella17@gmail.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between">
          <a
            href="/blogs"
            className="px-8 py-4 bg-white border-2 border-orange-500 text-orange-500 rounded-full font-bold text-center hover:bg-orange-50 transition-all"
          >
            ← Back to All Posts
          </a>
          <a
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-bold text-center shadow-lg hover:shadow-xl transition-all"
          >
            Return to Home →
          </a>
        </div>
      </div>
    </div>
  );
}
