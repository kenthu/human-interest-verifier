import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Header() {
  const pages = [
    {
      href: ['/'],
      name: 'Home',
    },
    {
      href: ['/verifier', '/verifier/results'],
      name: 'Verifier',
    },
  ];

  const { asPath } = useRouter();

  return (
    <div className="container">
      <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
        <Link
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
        >
          <span className="fs-4">Human Interest 401(k) Verifier</span>
        </Link>
        <ul className="nav nav-pills">
          {pages.map((page) => {
            const onThisPage = page.href.includes(asPath);
            const ariaCurrent = onThisPage ? 'page' : undefined;
            const activeClass = onThisPage ? 'active' : '';
            return (
              <li className="nav-item" key={page.href[0]}>
                <Link
                  href={page.href[0]}
                  className={`nav-link ${activeClass}`}
                  aria-current={ariaCurrent}
                >
                  {page.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </header>
    </div>
  );
}
