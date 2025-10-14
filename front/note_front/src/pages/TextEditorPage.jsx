import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/text/Sidebar";
import { DefaultTemplate } from "../components/text/DefaultTemplate";
import { useText } from "../hook/useText";
import { lexkitJSONToMarkdown } from "../components/text/lexkitJSONToMarkdown";

export default function TextEditorPage() {
  const [selectedText, setSelectedText] = useState(null);
  const { texts, setTexts, loading, error, setError, addText, deleteText, updateText } = useText();
  const editorRef = useRef(null);
  const [lastContent, setLastContent] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
 
  // Ajouter un texte
  const handleAddText = async () => {
    // Création côté serveur via l'API
    const newText = await addText({"root": {"children": [{"children": [
              {
                "detail": 0,
                "format": 0,
                "mode": "normal",
                "style": "",
                "text": "Nouveau texte",
                "type": "text",
                "version": 1
              }
            ],
            "direction": null,
            "format": "",
            "indent": 0,
            "type": "heading",
            "version": 1,
            "tag": "h1"
          }]}});
  

    if (newText) {
      // Ajouter le texte reçu dans l'état local
      setSelectedText(newText);
      // Initialiser l'éditeur avec du markdown vide
      setTimeout(() => {
        editorRef.current?.injectMarkdown("");
      }, 100);
    }
  };

  const handleSelectText = (text) => {
    setError(null);
    if (!editorRef.current) return;
    let contentObj;
    try {
      contentObj = JSON.parse(text.content); // parse la string JSON
    } catch (e) {
      //console.error("Impossible de parser JSON :", e);
      setError("Une erreur est survenue...");
      return;
    }

    const markdown = lexkitJSONToMarkdown(contentObj.root || contentObj);
     editorRef.current.injectMarkdown?.(markdown)
    || editorRef.current.setMarkdown?.(markdown)
    || editorRef.current.setValue?.(markdown); 

    //console.log("ContentObj: ", contentObj.root);

    setSelectedText(text);

    //console.log("=== Markdown length ===", markdown.length);
    //console.log(markdown.slice(0, 500));
  };  

  // Synchronisation avec ton éditeur
  const handleEditorChange = () => {
    if (!selectedText || !editorRef.current) return;

    const updatedContent = editorRef.current.getJSON(); 
    //console.log("updatedContent : ", updatedContent);
    
    const serializedContent = JSON.stringify(updatedContent);
   // console.log("serializedContent : ", serializedContent);

     // Ne rien faire si le contenu n'a pas changé
    if (serializedContent === lastContent) return;

    // Log pour vérifier le contenu
   // console.log("Contenu modifié :", updatedContent);

    setLastContent(serializedContent);

    setTexts(prev =>
      prev.map(t =>
        t.id === selectedText.id ? { ...t, content: serializedContent } : t
      )
    );
    updateText(selectedText.id, { content: serializedContent });
  };

   // Focus automatique sur click dans l'éditeur
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest(".lexkit-editor")) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

    // Autosave toutes les secondes seulement si focus
    useEffect(() => {
      if (!selectedText) return;

      const interval = setInterval(() => {
        if (isFocused) handleEditorChange();
      }, 1000);

      return () => clearInterval(interval);
    }, [selectedText, isFocused]);

    if (loading) return <section><h1>Une erreur est survenue...</h1></section>;
    if (error) return <section><h1>Une erreur est survenue...</h1></section>;

  return (
    <div style={{ display: "flex", width: "100vw", marginLeft: "-29%", marginTop: "-4em" }}>
      <Sidebar
        texts={texts}
        selectedText={selectedText}
        onAddText={handleAddText}
        onSelectText={handleSelectText}
        onDeleteText={async (id) => {
          try {
            // Supprimer en base
            deleteText(id);
            // Mettre à jour le state
            setTexts(prev => prev.filter(t => t.id !== id));
            
            // Déselectionner si besoin
            if (selectedText?.id === id) setSelectedText(null);
          } catch (error) {
            setError("Erreur lors de la suppression");
          }
        }}
      />
      
      <div style={{ marginLeft: "16rem", flex: 1, padding: "1rem" }} >
        <DefaultTemplate
          ref={editorRef}
          onReady={() => handleEditorChange()}
        />
      </div>
</div>
  );
};
