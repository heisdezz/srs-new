export default function PageFooter() {
  return (
    <div className="bg-neutral text-neutral-content py-12">
      <footer className="container mx-auto p-4  divide-y *:py-4 *:fade">
        <h2 className="text-4xl font-bold pr-4 font-lobster-two">
          StuffsAreUs
        </h2>
        <div className="flex gap-4 text-sm text-current/70">
          <a href="#" className="link link-hover">
            Terms
          </a>
          <a href="#" className="link link-hover">
            DMCA
          </a>
          <a href="#" className="link link-hover">
            Contact
          </a>
          <a href="#" className="link link-hover">
            App
          </a>
        </div>
        <div className="space-y-2">
          <p>
            {" "}
            StuffsAreUs does not store any files on our server, we only linked
            to the media which is hosted on 3rd party services.
          </p>
          <p className="text-sm">© Anira.to. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
