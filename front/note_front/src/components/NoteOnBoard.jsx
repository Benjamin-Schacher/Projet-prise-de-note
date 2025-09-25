export function NoteOnBoard({ title , contentPreview, onButtonClick , dragHandleProps }) {



  return (
    <>
        <div className="note-on-board">
            <button className="btn note-on-board-btn" onClick={() => {
                                                          onButtonClick();
                                                        }}>Voir</button>
            <p className="note-on-board-title drag-handle" {...dragHandleProps}>{title}</p>
            <p className="note-on-board-contentPreview" {...dragHandleProps} >{contentPreview}...</p>
        </div>
    </>

  );
}