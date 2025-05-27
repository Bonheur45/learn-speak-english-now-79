
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link,
  Youtube,
  Maximize,
  Minimize
} from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useIsMobile } from "@/hooks/use-mobile";
import './RichEditorStyles.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichTextEditor = ({ value, onChange, placeholder = "Type your content here...", minHeight = "200px" }: RichTextEditorProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [plainText, setPlainText] = useState("");
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = value;
    setPlainText(tempDiv.textContent || "");
  }, [value]);

  const wordCount = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;

  const modules = {
    toolbar: false, // We'll use custom toolbar
  };

  const formats = [
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'align',
    'link'
  ];

  const handleFormat = (format: string, value?: any) => {
    const quill = (window as any).Quill;
    if (quill) {
      const editor = document.querySelector('.ql-editor') as any;
      if (editor && editor.__quill) {
        const range = editor.__quill.getSelection();
        if (range) {
          if (format === 'align') {
            editor.__quill.format('align', value);
          } else if (format === 'list') {
            editor.__quill.format('list', value);
          } else {
            editor.__quill.format(format, !editor.__quill.getFormat()[format]);
          }
        }
      }
    }
  };

  const insertYouTubeEmbed = () => {
    const url = prompt("Enter YouTube URL:");
    if (url && url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        const embedHtml = `<div class="youtube-embed" style="margin: 16px 0; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
          <iframe src="https://www.youtube.com/embed/${videoId}" 
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" 
                  frameborder="0" allowfullscreen></iframe>
        </div>`;
        
        const quill = (window as any).Quill;
        if (quill) {
          const editor = document.querySelector('.ql-editor') as any;
          if (editor && editor.__quill) {
            const range = editor.__quill.getSelection() || { index: 0, length: 0 };
            editor.__quill.clipboard.dangerouslyPasteHTML(range.index, embedHtml);
          }
        }
      }
    }
  };

  const CustomToolbar = () => (
    <div className={`flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b rounded-t-md ${isMobile ? 'justify-center' : ''}`}>
      {/* Text Formatting */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('bold')}
          className="h-8 w-8 p-0"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('italic')}
          className="h-8 w-8 p-0"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('underline')}
          className="h-8 w-8 p-0"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('list', 'bullet')}
          className="h-8 w-8 p-0"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('list', 'ordered')}
          className="h-8 w-8 p-0"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('align', false)}
          className="h-8 w-8 p-0"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('align', 'center')}
          className="h-8 w-8 p-0"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('align', 'right')}
          className="h-8 w-8 p-0"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleFormat('align', 'justify')}
          className="h-8 w-8 p-0"
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      {/* Media */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={insertYouTubeEmbed}
          className="h-8 w-8 p-0"
          title="Insert YouTube Video"
        >
          <Youtube className="h-4 w-4" />
        </Button>
      </div>

      {/* Fullscreen */}
      <div className="flex items-center ml-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="h-8 px-2"
          title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          {!isMobile && <span className="ml-1 text-xs">{isFullScreen ? "Exit" : "Full"}</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className={`rich-editor-container ${isFullScreen ? "fixed inset-0 z-50 bg-white p-4" : ""}`}>
      <div className={`${isFullScreen ? "h-full max-w-4xl mx-auto pt-4" : "w-full"}`}>
        <CustomToolbar />
        
        <div className={`editor-wrapper ${isFullScreen ? "h-[calc(100vh-120px)]" : ""}`} style={{ minHeight }}>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            modules={modules}
            formats={formats}
            className={`h-full rich-text-editor ${isFullScreen ? "quill-fullscreen" : ""}`}
          />
        </div>
        
        {!isFullScreen && (
          <div className="flex justify-between mt-2 px-2 text-gray-500 text-sm">
            <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
            <span>{plainText.length} characters</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;
