import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import Link from 'next/link';

export default function VerifierOverview() {
  return (
    <div className="px-4 my-4 col-lg-10">
      <h2 className="pb-2 border-bottom">Overview</h2>
      <p>
        This tool performs basic verification on how Human Interest reinvests your 401(k) funds
        after your company migrates from another 401(k) provider. <Link href="/">More Details</Link>
      </p>
      <p>
        To maintain your privacy and security, this tool does not ask for your Human Interest
        username and password. Instead, we will walk you through how to copy transaction data while
        logged in, then paste it into this tool.
      </p>
      <p>
        <FontAwesomeIcon icon={faExclamationTriangle} /> Note: This tool is not supported on mobile
        OSes like iOS, iPadOS, or Android.
      </p>
    </div>
  );
}
