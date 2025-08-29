export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-5">
      <div className="container-xxl py-3 text-center">
        <div className="small mb-2">© {year} Filipino Recipe Book</div>

        <div className="footer-social d-inline-flex gap-3">
          {/* GitHub */}
          <a
            href="https://github.com/Waldric"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="social-btn"
            title="GitHub"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.48v-1.72c-2.78.61-3.37-1.19-3.37-1.19-.46-1.18-1.12-1.5-1.12-1.5-.91-.63.07-.62.07-.62 1 .07 1.52 1.05 1.52 1.05.9 1.53 2.37 1.09 2.95.84.09-.66.35-1.1.63-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.56 9.56 0 0 1 5 0c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.86v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </svg>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/waldricjude.garcia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="social-btn"
            title="Facebook"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M22 12a10 10 0 1 0-11.57 9.9v-7h-2.4V12h2.4v-2.3c0-2.37 1.42-3.68 3.58-3.68 1.04 0 2.13.19 2.13.19v2.34h-1.2c-1.18 0-1.54.73-1.54 1.48V12h2.62l-.42 2.9h-2.2v7A10 10 0 0 0 22 12Z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
