import React, { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { ThemeProvider } from "styled-components";
import Highlighter from "react-highlight-words";
import { theme } from "../styles/Theme";
import { RemoveHighlightButton } from "./RemoveHighlightButton";
import { Container, HighlightedText, SearchInput, PageHome } from "../styles/Search.styled";
import Content, { ContentItem } from "./content";
import FloatingHighlightButton from "./FloatingButtons";

//กำหนด interface สำหรับ Highlight
interface Highlight {
    contentId: string;  // ID ของ content ที่ถูกไฮไลท์
    start: number;      // ตำแหน่งเริ่มต้นของการไฮไลท์  
    end: number;        // ตำแหน่งสิ้นสุดของการไฮไลท์  
    color: string;      // สีของการไฮไลท์
}

// กำหนด interface สำหรับตำแหน่งของปุ่มไฮไลท์
interface ButtonPosition {
    top: number;
    left: number;
}

const SearchComponent: React.FC = () => {
    // State สำหรับเก็บข้อความที่ใช้ในการค้นหา
    const [searchText, setSearchText] = useState('');

    // State สำหรับเก็บรายการไฮไลท์ทั้งหมด
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    
    // State สำหรับเก็บสีปัจจุบันที่ใช้ในการไฮไลท์
    const [currentColor, setCurrentColor] = useState('#ffff00');
    
    // State สำหรับเก็บตำแหน่งของปุ่มไฮไลท์
    const [buttonPosition, setButtonPosition] = useState<ButtonPosition | null>(null);
    
    // Ref สำหรับเก็บอ้างอิงถึง DOM elements ของแต่ละ content
    const contentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // ฟังก์ชันสำหรับคำนวณตำแหน่งข้อความและไฮไลท์อักขระสุดท้าย
    const getTextInfo = useCallback((contentId: string, node: Node, offset: number): { position: number, isLastChar: boolean } => {
        const root = contentRefs.current[contentId];
        if (!root) return { position: 0, isLastChar: false };

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
        let position = 0;
        let isLastChar = false;

        while (walker.nextNode()) {
            const nodeLength = walker.currentNode.textContent?.length || 0;
            if (walker.currentNode === node) {
                position += offset;
                isLastChar = (offset === nodeLength - 1) && !walker.nextSibling();
                break;
            }
            position += nodeLength;
        }

        return { position, isLastChar };
    }, []);

    // ฟังก์ชันจัดการการเลือกข้อความ และแสดงปุ่มไฮไลท์
    const handleSelection = useCallback(() => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0 && selection.toString().trim() !== '') {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            
            // กำหนดตำแหน่งของปุ่มไฮไลท์
            setButtonPosition({
                top: rect.top + window.scrollY - 40,
                left: rect.left + window.scrollX + (rect.width / 2)
            });
        } else {
            setButtonPosition(null);
        }
    }, []);

    // ฟังก์ชันสำหรับเพิ่มการไฮไลท์ใหม่เข้าไปใน state
    const addHighlight = useCallback((newHighlight: Highlight) => {
        setHighlights(prevHighlights => [...prevHighlights, newHighlight]);
    }, []);

    // ฟังก์ชันสำหรับลบการไฮไลท์ออกจาก state โดยใช้ index
    const removeHighlight = useCallback((index: number) => {
        setHighlights(prevHighlights => prevHighlights.filter((_, i) => i !== index));
    }, []);

    // ฟังก์ชันไฮไลท์ข้อความที่ถูกเลือก
    const handleHighlight = useCallback(() => {
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        const range = selection.getRangeAt(0);

        // หา contentId ของข้อความที่ถูกเลือก
        let contentId = '';
        for (const [id, ref] of Object.entries(contentRefs.current)) {
            if (ref && ref.contains(range.commonAncestorContainer)) {
                contentId = id;
                break;
            }
        }

        if (!contentId) return;

        // คำนวณตำแหน่งเริ่มต้นและสิ้นสุดของการไฮไลท์
        const { position: start, isLastChar: isStartLastChar } = getTextInfo(contentId, range.startContainer, range.startOffset);
        const { position: end, isLastChar: isEndLastChar } = getTextInfo(contentId, range.endContainer, range.endOffset);

        if (start !== end || isStartLastChar || isEndLastChar) {
            
            // เพิ่มการไฮไลท์ใหม่
            addHighlight({ 
                contentId,
                start, 
                end: isEndLastChar ? end + 1 : end, 
                color: currentColor 
            });
            selection.removeAllRanges();
            setButtonPosition(null);
        }
    }, [currentColor, getTextInfo, addHighlight]);

    // สร้าง object ที่จัดกลุ่มการไฮไลท์ตาม contentId เพื่อเพิ่มประสิทธิภาพการ render
    const highlightsByContent = useMemo(() => {
        return highlights.reduce((acc, highlight) => {
            if (!acc[highlight.contentId]) {
                acc[highlight.contentId] = [];
            }
            acc[highlight.contentId].push(highlight);
            return acc;
        }, {} as { [key: string]: Highlight[] });
    }, [highlights]);

    // สร้างการไฮไลท์แบบกำหนดเอง
    const renderCustomHighlights = useCallback((contentId: string) => {
            const container = contentRefs.current[contentId];
            if (!container) return null;
            
            return highlightsByContent[contentId]?.map((highlight, index) => {

                    const range = document.createRange();
                    const startNode = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
                    const endNode = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
                    let startOffset = highlight.start;
                    let endOffset = highlight.end;

                    // หาตำแหน่งของ node ที่ถูกไฮไลท์
                    while (startNode.nextNode() && startOffset > (startNode.currentNode.textContent?.length || 0)) {
                        startOffset -= startNode.currentNode.textContent?.length || 0;
                    }
                    while (endNode.nextNode() && endOffset > (endNode.currentNode.textContent?.length || 0)) {
                        endOffset -= endNode.currentNode.textContent?.length || 0;
                    }

                    if (!startNode.currentNode || !endNode.currentNode) return null;

                    try {
                        range.setStart(startNode.currentNode, startOffset);
                        range.setEnd(endNode.currentNode, endOffset);
                    } catch (error) {
                        console.error("Error setting range:", error);
                        return null;
                    }

                    // สร้าง div elements สำหรับแสดงการไฮไลท์
                    const rects = range.getClientRects();
                    const containerRect = container.getBoundingClientRect();

                    return Array.from(rects).map((rect, rectIndex) => (
                        <div
                            key={`${contentId}-${index}-${rectIndex}`}
                            className="custom-highlight"
                            style={{
                                position: 'absolute',
                                left: `${rect.left - containerRect.left}px`,
                                top: `${rect.top - containerRect.top}px`,
                                width: `${rect.width}px`,
                                height: `${rect.height}px`,
                                backgroundColor: highlight.color,
                                opacity: 0.5,
                                pointerEvents: 'none',
                            }}
                        />
                    ));
                }) || null;
        }, [highlightsByContent]);

    // เพิ่ม event listener สำหรับการเลือกข้อความ
    useEffect(() => {
        document.addEventListener('selectionchange', handleSelection);
        return () => document.removeEventListener('selectionchange', handleSelection);
    }, [handleSelection]);

    return (
        <ThemeProvider theme={theme}>
            <PageHome>
                <Container>
                    {/* ช่องค้นหา */}
                    <SearchInput 
                        type="text"
                        placeholder="ค้นหา..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    {/* แสดงเนื้อหาและการไฮไลท์ */}
                    {Content.map((item: ContentItem) => (
                        <HighlightedText 
                            key={item.id}
                            ref={(el) => contentRefs.current[item.id] = el}
                        >
                            <Highlighter
                                highlightClassName="highlight"
                                searchWords={[searchText]}
                                autoEscape={true}
                                textToHighlight={item.text}
                            />
                        {renderCustomHighlights(item.id)}
                    </HighlightedText>
                    ))}
                    {/* ปุ่มไฮไลท์ลอย */}
                    {buttonPosition && (
                        <FloatingHighlightButton
                            onHighlight={handleHighlight}
                            currentColor={currentColor}
                            onColorChange={setCurrentColor}
                            top={buttonPosition.top}
                            left={buttonPosition.left}
                        />
                    )}
                    {/* ปุ่มลบการไฮไลท์ */}
                    <div>
                        {highlights.map((highlight, index) => (
                            <RemoveHighlightButton 
                                key={index}
                                onClick={() => removeHighlight(index)}
                                color={highlight.color}
                            >
                                ลบไฮไลท์
                            </RemoveHighlightButton>
                        ))}
                    </div>
                </Container>
            </PageHome>
        </ThemeProvider>
    );
};

export default SearchComponent;