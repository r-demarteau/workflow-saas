<script lang="ts">
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: 'How to Host Your WooCommerce Store on Hetzner: A Complete Setup Guide',
		description:
			'A step-by-step guide to hosting WordPress and WooCommerce on a Hetzner VPS — covering server setup, nginx, PHP, MariaDB, WordPress installation, and SSL.',
		author: { '@type': 'Organization', name: 'Teamdock' },
		publisher: {
			'@type': 'Organization',
			name: 'Teamdock',
			logo: { '@type': 'ImageObject', url: 'https://teamdock.ai/favicon-96x96.png' }
		},
		datePublished: '2026-05-17',
		dateModified: '2026-05-17',
		url: 'https://teamdock.ai/blog/woocommerce-hetzner-hosting-guide',
		image: 'https://teamdock.ai/og-image.svg',
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': 'https://teamdock.ai/blog/woocommerce-hetzner-hosting-guide'
		}
	};
</script>

<svelte:head>
	<title>How to Host Your WooCommerce Store on Hetzner: A Complete Setup Guide — Teamdock</title>
	<meta
		name="description"
		content="Step-by-step guide to self-hosting WordPress and WooCommerce on a Hetzner VPS. Covers server setup, nginx, PHP 8.3, MariaDB, WordPress CLI install, and free SSL with Let's Encrypt."
	/>
	<link rel="canonical" href="https://teamdock.ai/blog/woocommerce-hetzner-hosting-guide" />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://teamdock.ai/blog/woocommerce-hetzner-hosting-guide" />
	<meta
		property="og:title"
		content="How to Host Your WooCommerce Store on Hetzner: A Complete Setup Guide"
	/>
	<meta
		property="og:description"
		content="Step-by-step guide to self-hosting WooCommerce on a Hetzner VPS — nginx, PHP, MariaDB, WordPress, and SSL in under an hour."
	/>
	<meta property="og:image" content="https://teamdock.ai/og-image.svg" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="WooCommerce on Hetzner: Complete Hosting Setup Guide" />
	<meta
		name="twitter:description"
		content="Self-host WooCommerce on a Hetzner VPS for €4/mo. Step-by-step: nginx, PHP 8.3, MariaDB, WordPress, SSL."
	/>
	<meta name="twitter:image" content="https://teamdock.ai/og-image.svg" />
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}<\/script>`}
</svelte:head>

<div class="pt-28 pb-24">
	<div class="mx-auto max-w-3xl px-6">

		<!-- Breadcrumb -->
		<nav class="mb-10 flex items-center gap-2 text-sm text-gray-400" aria-label="Breadcrumb">
			<a href="/" class="hover:text-gray-600">Home</a>
			<span>/</span>
			<a href="/blog" class="hover:text-gray-600">Blog</a>
			<span>/</span>
			<span class="text-gray-600">WooCommerce on Hetzner</span>
		</nav>

		<!-- Header -->
		<header class="mb-12">
			<div class="mb-4 flex items-center gap-3">
				<span class="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">Hosting & setup</span>
				<span class="text-xs text-gray-400">15 min read · May 2026</span>
			</div>
			<h1 class="text-4xl font-extrabold leading-tight text-gray-900 md:text-5xl">
				How to Host Your WooCommerce Store on Hetzner: A Complete Setup Guide
			</h1>
			<p class="mt-6 text-xl leading-relaxed text-gray-500">
				Managed WordPress hosting can cost €30–€100/month for a single store. A Hetzner VPS starts
				at €4/month and gives you full control, EU data residency, and performance that managed
				hosts charge a premium for. This guide walks you through the complete setup from a blank
				server to a live WooCommerce store.
			</p>
		</header>

		<!-- Article body -->
		<article class="prose prose-gray prose-lg max-w-none">

			<h2>Why Hetzner for WooCommerce?</h2>
			<p>
				Hetzner is a German cloud provider with data centres in Nuremberg, Falkenstein, and
				Helsinki — all within the EU, which matters for GDPR compliance. Their pricing is
				consistently among the lowest in Europe without cutting corners on hardware: NVMe SSDs,
				dedicated vCPUs, and 1 Gbps network connections are standard.
			</p>
			<p>
				For a WooCommerce store handling up to a few thousand orders a month, a single Hetzner VPS
				is more than sufficient and significantly cheaper than equivalent managed hosting. You also
				get the flexibility to install exactly what you need — no hosting panel upsells, no
				resource limits that mysteriously kick in during traffic spikes.
			</p>

			<h2>Choosing the right server</h2>
			<p>
				For most WooCommerce stores, the <strong>CX22</strong> (2 vCPU, 4 GB RAM, 40 GB NVMe,
				~€4/mo) is the right starting point. It handles WordPress comfortably and leaves room to
				grow. If you're running multiple stores, have a busy catalogue, or expect significant
				concurrent traffic, step up to the <strong>CX32</strong> (4 vCPU, 8 GB RAM, 80 GB NVMe,
				~€7/mo).
			</p>
			<p>
				Choose <strong>Ubuntu 24.04 LTS</strong> as your operating system — it has long-term
				support until 2029, excellent package availability for the PHP and nginx versions you
				need, and is the most widely documented Linux distribution for web server setups.
			</p>
			<p>
				Select a datacenter in <strong>Nuremberg or Falkenstein</strong> for EU-based stores.
				Add your SSH public key during server creation — you'll need it to connect.
			</p>

			<h2>Initial server setup</h2>
			<p>
				Once your server is provisioned (usually under 30 seconds), SSH in as root:
			</p>
			<pre><code>ssh root@YOUR_SERVER_IP</code></pre>
			<p>
				Update the system and install essential utilities:
			</p>
			<pre><code>apt update && apt upgrade -y
apt install -y ufw curl git unzip</code></pre>
			<p>
				Configure the firewall to allow SSH, HTTP, and HTTPS, then enable it:
			</p>
			<pre><code>ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable</code></pre>
			<p>
				Create a non-root user for day-to-day operations:
			</p>
			<pre><code>adduser deploy
usermod -aG sudo deploy
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy</code></pre>
			<p>
				From this point, you can SSH in as <code>deploy</code> instead of root.
			</p>

			<h2>Installing the web stack</h2>
			<p>
				WooCommerce runs on PHP and MySQL/MariaDB, served via either nginx or Apache. We'll use
				<strong>nginx</strong> (faster, lower memory footprint) with <strong>PHP 8.3</strong> and
				<strong>MariaDB 10.11</strong>.
			</p>

			<h3>nginx</h3>
			<pre><code>apt install -y nginx
systemctl enable nginx
systemctl start nginx</code></pre>

			<h3>PHP 8.3</h3>
			<p>WordPress and WooCommerce work best on PHP 8.2+. Add the Ondrej PPA for the latest PHP releases:</p>
			<pre><code>apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update
apt install -y php8.3-fpm php8.3-mysql php8.3-curl php8.3-gd \
  php8.3-intl php8.3-mbstring php8.3-soap php8.3-xml \
  php8.3-xmlrpc php8.3-zip php8.3-imagick php8.3-bcmath</code></pre>
			<p>Tune a few PHP settings for WooCommerce performance:</p>
			<pre><code># Edit /etc/php/8.3/fpm/php.ini
upload_max_filesize = 64M
post_max_size = 64M
max_execution_time = 300
memory_limit = 256M</code></pre>

			<h3>MariaDB</h3>
			<pre><code>apt install -y mariadb-server
systemctl enable mariadb
mysql_secure_installation</code></pre>
			<p>Create a database and user for WordPress:</p>
			<pre><code>mysql -u root -p
CREATE DATABASE woocommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON woocommerce.* TO 'wpuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;</code></pre>

			<h2>Configuring nginx for WordPress</h2>
			<p>
				Create a server block for your domain. Replace <code>yourdomain.com</code> with your
				actual domain — make sure your DNS A record is already pointing to your server IP.
			</p>
			<pre><code># /etc/nginx/sites-available/yourdomain.com
server &#123;
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/yourdomain.com;
    index index.php index.html;

    client_max_body_size 64M;

    location / &#123;
        try_files $uri $uri/ /index.php?$args;
    &#125;

    location ~ \.php$ &#123;
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
    &#125;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ &#123;
        expires max;
        log_not_found off;
    &#125;

    location = /favicon.ico &#123; log_not_found off; access_log off; &#125;
    location = /robots.txt  &#123; log_not_found off; access_log off; &#125;
    location ~ /\.          &#123; deny all; &#125;
&#125;</code></pre>
			<p>Enable the site and reload nginx:</p>
			<pre><code>ln -s /etc/nginx/sites-available/yourdomain.com /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx</code></pre>

			<h2>Installing WordPress with WP-CLI</h2>
			<p>
				WP-CLI is the command-line tool for WordPress. It's the fastest way to install and
				configure WordPress without touching a browser:
			</p>
			<pre><code>curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
chmod +x wp-cli.phar
mv wp-cli.phar /usr/local/bin/wp</code></pre>
			<p>Create the web root and install WordPress:</p>
			<pre><code>mkdir -p /var/www/yourdomain.com
cd /var/www/yourdomain.com

wp core download --allow-root
wp config create \
  --dbname=woocommerce \
  --dbuser=wpuser \
  --dbpass=STRONG_PASSWORD_HERE \
  --allow-root
wp core install \
  --url=https://yourdomain.com \
  --title="Your Store Name" \
  --admin_user=admin \
  --admin_password=ADMIN_PASSWORD \
  --admin_email=you@yourdomain.com \
  --allow-root

chown -R www-data:www-data /var/www/yourdomain.com
find /var/www/yourdomain.com -type d -exec chmod 755 &#123;&#125; \;
find /var/www/yourdomain.com -type f -exec chmod 644 &#123;&#125; \;</code></pre>

			<h2>Installing WooCommerce</h2>
			<p>With WP-CLI, installing and activating WooCommerce is a single command:</p>
			<pre><code>wp plugin install woocommerce --activate --allow-root</code></pre>
			<p>
				Run the WooCommerce setup wizard from the WordPress admin (<code>yourdomain.com/wp-admin</code>)
				to configure your store currency, payment methods, and shipping zones. This takes around
				5 minutes and can't be done via CLI.
			</p>

			<h2>Free SSL with Let's Encrypt</h2>
			<p>
				Certbot handles SSL certificate issuance and renewal automatically. Install it and
				get your certificate:
			</p>
			<pre><code>apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com</code></pre>
			<p>
				Certbot will update your nginx config to redirect HTTP to HTTPS and set up the SSL
				certificate. Certificates renew automatically via a systemd timer — run
				<code>certbot renew --dry-run</code> to verify the auto-renewal is working.
			</p>

			<h2>Performance basics</h2>
			<p>
				Before you launch, three quick wins that make a measurable difference for WooCommerce:
			</p>
			<p>
				<strong>Enable OPcache.</strong> PHP's built-in opcode cache dramatically reduces
				page load times. Add to <code>/etc/php/8.3/fpm/php.ini</code>:
			</p>
			<pre><code>opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.revalidate_freq=0</code></pre>
			<p>
				<strong>Install a caching plugin.</strong> WP Super Cache or W3 Total Cache serve
				static HTML to logged-out visitors, reducing PHP and database load significantly on
				product and category pages.
			</p>
			<p>
				<strong>Enable gzip compression in nginx.</strong> Add to your nginx config:
			</p>
			<pre><code>gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_min_length 1000;</code></pre>
			<p>
				With these three in place, a Hetzner CX22 running WooCommerce will handle several
				hundred concurrent visitors without breaking a sweat.
			</p>

			<h2>What's next — managing your store as a team</h2>
			<p>
				Once your WooCommerce store is live, the next challenge is operational: how does your
				team manage orders, handle customer queries, and track support tickets without everyone
				needing WordPress admin access?
			</p>
			<p>
				WooCommerce admin works fine for a solo store owner. For a team — even a small one of
				2–3 people — it quickly becomes a bottleneck. Orders get missed, customer messages pile
				up in a shared inbox, and there's no way to assign or track issues without a
				spreadsheet on the side.
			</p>
			<p>
				This is exactly the problem Teamdock solves: a dedicated operations workspace for
				WooCommerce teams, with order management, customer CRM, support tickets, live chat,
				and AI — all synced with your store and running on your own subdomain. Setup takes
				the same 5 minutes as the WordPress install above.
			</p>
		</article>

		<!-- CTA -->
		<div class="mt-16 rounded-2xl bg-gradient-to-br from-brand-950 to-brand-800 p-10 text-center">
			<h2 class="text-2xl font-bold text-white md:text-3xl">
				Store live? Now give your team a proper workspace.
			</h2>
			<p class="mt-3 text-brand-200">
				Teamdock connects to your WooCommerce store and gives your team everything they need
				to manage orders, customers, and support — without touching WordPress admin.
			</p>
			<div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
				<a
					href="/pricing"
					class="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-brand-700 shadow hover:bg-brand-50 transition-colors"
				>
					See pricing & start trial
				</a>
				<a
					href="/#features"
					class="inline-flex items-center justify-center rounded-lg border border-white/20 px-8 py-3.5 text-base font-semibold text-white hover:border-white/40 transition-colors"
				>
					Explore features
				</a>
			</div>
			<p class="mt-5 text-sm text-brand-400">First 14 days free · Cancel any time</p>
		</div>

		<!-- Back to blog -->
		<div class="mt-12 text-center">
			<a href="/blog" class="text-sm font-medium text-gray-400 hover:text-gray-600">
				← Back to blog
			</a>
		</div>

	</div>
</div>

<style>
	.prose h2 {
		@apply mt-12 mb-4 text-2xl font-bold text-gray-900;
	}
	.prose h3 {
		@apply mt-8 mb-3 text-xl font-semibold text-gray-900;
	}
	.prose p {
		@apply mb-5 leading-relaxed text-gray-600;
	}
	.prose pre {
		@apply mb-5 overflow-x-auto rounded-xl bg-gray-950 px-5 py-4 text-sm text-gray-100;
	}
	.prose code {
		@apply font-mono;
	}
	.prose p > code {
		@apply rounded bg-gray-100 px-1.5 py-0.5 text-sm text-gray-800 font-mono;
	}
	.prose strong {
		@apply font-semibold text-gray-800;
	}
</style>
