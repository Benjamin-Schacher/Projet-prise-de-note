function NoteOnBoard({ title , contentPreview}) {



  return (
    <>
        <div class="note-on-board">
           <p class="note-on-board-title">{title}</p>
           <p class="note-on-board-contentPreview" >{contentPreview}...</p>
        </div>
    </>

  );
}

export default NoteOnBoard;