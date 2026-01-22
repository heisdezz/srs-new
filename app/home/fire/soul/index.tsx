import { useRef } from "react";

export default function index() {
  let dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <div>
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box">
          hello
        </div>
      </dialog>
      souls{" "}
      <button
        onClick={() => {
          dialogRef.current?.showModal()
        }}
        className="btn btn-primary md:btn-xl"
      >
        button
      </button>
    </div>
  );
}
