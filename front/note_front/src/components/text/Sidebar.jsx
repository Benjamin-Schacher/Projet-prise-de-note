// Gestion du bloc de gauche pour afficher les textes
const Sidebar = ({
  texts,
  selectedText,
  onSelectText,
  onAddText,
  onDeleteText,
  sidebarWidth = '17rem'
}) => {
  return (
    <div 
      className="bg-gray-900 text-white p-2 border-r border-gray-700 overflow-y-auto" 
      style={{ 
        width: sidebarWidth,
        height: 'calc(100vh)',
        position: 'fixed',
        left: 0,
        top: 0,
        paddingTop: '6em'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={(e) =>{e.preventDefault(); onAddText();}} // crée directement un nouveau texte
          className="bg-blue-600 hover:bg-blue-900 text-white px-3 py-1 rounded text-sm"
        >
          + Nouveau texte
        </button>
      </div>

      <div className="space-y-2">
        {Array.isArray(texts) && texts.map(text => (
          <div
            key={text.id}
            onClick={(e) => { e.preventDefault(); onSelectText(text);}}
            className={` flex items-center p-2 rounded cursor-pointer text-left text-sm ${
              selectedText?.id === text.id ? 'bg-gray-700' : 'hover:bg-gray-800'
            }`}
          >
            <article>
              <h3 className="font-bold">{text.title || "Sans titre"}</h3>
              <p>{"Modifié le " + new Date(text.updatedAt).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </article>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteText(text.id); }}
              className="ml-2 text-red-500 hover:text-red-400 text-xs"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
