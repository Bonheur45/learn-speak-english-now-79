import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Minimize, Bold, Italic, Underline, BookOpen } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useIsMobile } from "@/hooks/use-mobile";
import './RichEditorStyles.css';

interface TextEditorProps {
  text: string;
  setText: (text: string) => void;
}

const TextEditor = ({ text, setText }: TextEditorProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [plainText, setPlainText] = useState("");
  const isMobile = useIsMobile();
  
  // Update plainText when text changes (for word/character count)
  useEffect(() => {
    // Create temporary div to parse HTML and get text content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = text;
    setPlainText(tempDiv.textContent || "");
  }, [text]);

  // Calculate word count
  const wordCount = plainText.trim() 
    ? plainText.trim().split(/\s+/).length 
    : 0;

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ]
  };

  // Custom toolbar component
  const CustomToolbar = () => (
    <div className={`${isMobile ? "flex flex-col space-y-2" : "flex items-center justify-between"} mb-2 bg-gray-50 p-2 rounded border w-full`}>
      {/* Only show logo on mobile when in fullscreen mode OR on desktop when in fullscreen mode */}
      {((isMobile && isFullScreen) || (isFullScreen && !isMobile)) && (
        <div className="flex items-center gap-2 justify-center pb-2 md:pb-0">
          <BookOpen size={20} className="text-emerald-500" />
          <span className="font-medium">Let's Do It English</span>
        </div>
      )}
      
      {/* Show formatting controls for mobile layout */}
      {isMobile && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const quill = document.querySelector('.ql-editor');
              if (quill) document.execCommand('bold');
            }}
            className="hover:bg-slate-200"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const quill = document.querySelector('.ql-editor');
              if (quill) document.execCommand('italic');
            }}
            className="hover:bg-slate-200"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const quill = document.querySelector('.ql-editor');
              if (quill) document.execCommand('underline');
            }}
            className="hover:bg-slate-200"
          >
            <Underline className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullScreen}
            className="hover:bg-slate-200"
          >
            {isFullScreen ? (
              <Minimize className="h-4 w-4 mr-2" />
            ) : (
              <Maximize className="h-4 w-4 mr-2" />
            )}
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </Button>
        </div>
      )}
      
      {/* Desktop layout */}
      {!isMobile && (
        <>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const quill = document.querySelector('.ql-editor');
                if (quill) document.execCommand('bold');
              }}
              className="hover:bg-slate-200"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const quill = document.querySelector('.ql-editor');
                if (quill) document.execCommand('italic');
              }}
              className="hover:bg-slate-200"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const quill = document.querySelector('.ql-editor');
                if (quill) document.execCommand('underline');
              }}
              className="hover:bg-slate-200"
            >
              <Underline className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Full screen button always on the right for desktop */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullScreen}
            className="hover:bg-slate-200 ml-auto"
          >
            {isFullScreen ? (
              <Minimize className="h-4 w-4 mr-2" />
            ) : (
              <Maximize className="h-4 w-4 mr-2" />
            )}
            {isFullScreen ? "Exit Full Screen" : "Full Screen"}
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className={`editor-container flex-1 flex flex-col transition-all duration-300 ${
      isFullScreen ? "fixed inset-0 z-50 bg-white p-4" : ""
    }`}>
      <div className={`${isFullScreen 
        ? "pt-4 w-full max-w-5xl mx-auto" 
        : "w-full"} h-full`}>
        <CustomToolbar />
        
        <div className={`editor-wrapper flex-1 ${
          isFullScreen 
            ? "h-[calc(100vh-100px)]" 
            : isMobile 
              ? "min-h-[300px]" 
              : "min-h-[300px]"
        }`}>
          <ReactQuill
            theme="snow"
            value={text}
            onChange={setText}
            placeholder="Type or paste your text here for assessment..."
            modules={modules}
            className={`h-full ${isFullScreen ? "quill-fullscreen" : ""}`}
          />
        </div>
        
        {!isFullScreen && (
          <div className="flex justify-between mt-2 text-gray-500 text-sm">
            <span>{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
            <span>{plainText.length} characters</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextEditor;
