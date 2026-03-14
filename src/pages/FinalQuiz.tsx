import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import StudentHeader from "../components/StudentHeader";
import EducatorHeader from "../components/EducatorHeader";
import XPToast from "../components/XPToast";

// ─── Types ────────────────────────────────────────────────────────────────────
type QuestionType =
  | "mcq-text"
  | "mcq-image"
  | "fill-blank"
  | "match"
  | "drag-words"
  | "drag-images";

interface MCQOption {
  id: string;
  text: string;
  image?: string;
  emoji?: string;
}
interface MatchPair {
  left: string;
  right: string;
}
interface ImageItem {
  id: string;
  label: string;
  src: string;
  category: string;
}

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: MCQOption[];
  correctAnswer?: string;
  blanks?: string[];
  pairs?: MatchPair[];
  wordBank?: string[];
  sentence?: string;
  imageCategories?: { label: string; color: string }[];
  imageItems?: ImageItem[];
}

// ─── Questions ────────────────────────────────────────────────────────────────
const questions: Question[] = [
  {
    id: 1,
    type: "mcq-text",
    question: "What is a Savings Account?",
    options: [
      {
        id: "a",
        text: "An account where money is locked for a fixed period and cannot be withdrawn",
      },
      {
        id: "b",
        text: "An account that earns interest and lets you deposit or withdraw anytime",
      },
      { id: "c", text: "A loan given by the bank to help you buy things" },
      { id: "d", text: "An account only available to business owners" },
    ],
    correctAnswer: "b",
  },
  {
    id: 2,
    type: "mcq-image",
    question:
      "Which image best represents the habit of saving money regularly?",
    options: [
      { id: "a", text: "Savings Account", image: "/piggy_logo.png" },
      { id: "b", text: "Shopping Bag", emoji: "🛍️" },
      { id: "c", text: "Eating Out", emoji: "🍽️" },
      { id: "d", text: "Video Game", emoji: "🎮" },
    ],
    correctAnswer: "a",
  },
  {
    id: 3,
    type: "fill-blank",
    question:
      "A Fixed Deposit gives ___ interest than a regular Savings Account. (higher or lower)",
    blanks: ["higher", "more"],
  },
  {
    id: 4,
    type: "match",
    question: "Match each financial tool with what it is best used for:",
    pairs: [
      { left: "Savings Account", right: "Emergency fund & daily use" },
      { left: "Fixed Deposit", right: "Long-term growth with locked money" },
      { left: "Pocket Cash", right: "Immediate small expenses" },
    ],
  },
  {
    id: 5,
    type: "drag-words",
    question: "Drag the correct words to complete the sentence:",
    sentence:
      "A Fixed Deposit ___ your money for a set period and gives ___ interest than a savings account.",
    wordBank: ["locks", "higher", "frees", "lower", "doubles"],
  },
  {
    id: 6,
    type: "mcq-text",
    question:
      "Why is it important to keep some money in a Savings Account even if you have Fixed Deposits?",
    options: [
      {
        id: "a",
        text: "Savings accounts always earn more interest than Fixed Deposits",
      },
      { id: "b", text: "You can access savings anytime to handle emergencies" },
      { id: "c", text: "Fixed Deposits are not protected by the bank" },
      {
        id: "d",
        text: "The government requires you to have a savings account",
      },
    ],
    correctAnswer: "b",
  },
  {
    id: 8,
    type: "drag-images",
    question:
      "Drag each item into the correct category — Savings Account or Fixed Deposit:",
    imageCategories: [
      { label: "Savings Account", color: "green" },
      { label: "Fixed Deposit", color: "orange" },
    ],
    imageItems: [
      {
        id: "i1",
        label: "Withdraw anytime",
        src: "/piggy_logo.png",
        category: "Savings Account",
      },
      {
        id: "i4",
        label: "Higher interest rate",
        src: "/sapling1.png",
        category: "Fixed Deposit",
      },
    ],
  },
  {
    id: 10,
    type: "mcq-text",
    question: "What is the smartest financial strategy for a young saver?",
    options: [
      { id: "a", text: "Put all money into Fixed Deposits so it grows faster" },
      {
        id: "b",
        text: "Keep all money as pocket cash so it is always available",
      },
      {
        id: "c",
        text: "Balance a savings account for emergencies and Fixed Deposits for long-term growth",
      },
      {
        id: "d",
        text: "Spend everything now and start saving only after earning a salary",
      },
    ],
    correctAnswer: "c",
  },
];

// ─── Answer checker ───────────────────────────────────────────────────────────
function checkAnswer(q: Question, userAnswer: unknown): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;
  if (q.type === "mcq-text" || q.type === "mcq-image")
    return userAnswer === q.correctAnswer;
  if (q.type === "fill-blank") {
    return q.blanks!.some(
      (b) => b.toLowerCase() === (userAnswer as string).trim().toLowerCase(),
    );
  }
  if (q.type === "match") {
    const ua = userAnswer as Record<string, string>;
    return q.pairs!.every((p) => ua[p.left] === p.right);
  }
  if (q.type === "drag-words") {
    const ua = userAnswer as string[];
    const correct = ["locks", "higher"];
    return ua.length === correct.length && ua.every((w, i) => w === correct[i]);
  }
  if (q.type === "drag-images") {
    const ua = userAnswer as Record<string, string>;
    return q.imageItems!.every((item) => ua[item.id] === item.category);
  }
  return false;
}

// ─── Draggable chip ───────────────────────────────────────────────────────────
function DraggableChip({
  id,
  label,
  disabled,
}: {
  id: string;
  label: string;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id, disabled });
  const style = transform
    ? { transform: `translate(${transform.x}px,${transform.y}px)`, zIndex: 50 }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`px-4 py-2 rounded-xl border-2 font-semibold select-none transition-all
        ${
          disabled
            ? "opacity-40 cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            : isDragging
              ? "opacity-0"
              : "cursor-grab active:cursor-grabbing border-blue-300 bg-blue-100 text-blue-800 hover:border-blue-500"
        }`}
    >
      {label}
    </div>
  );
}

// ─── Droppable zone ───────────────────────────────────────────────────────────
function DroppableZone({
  id,
  label,
  children,
  highlight,
}: {
  id: string;
  label?: string;
  children?: React.ReactNode;
  highlight?: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[52px] rounded-2xl border-2 border-dashed transition-colors p-2
        ${isOver ? "border-green-500 bg-green-50" : highlight ? "border-green-400 bg-green-50" : "border-gray-300 bg-gray-50"}`}
    >
      {label && <div className="text-xs text-gray-400 mb-1">{label}</div>}
      {children}
    </div>
  );
}

// ─── MCQ Text ─────────────────────────────────────────────────────────────────
function MCQText({
  q,
  onSubmit,
}: {
  q: Question;
  onSubmit: (ans: string | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {q.options!.map((opt) => (
        <button
          key={opt.id}
          onClick={() => setSelected(opt.id)}
          className={`w-full cursor-pointer text-left px-5 py-4 rounded-2xl border-2 transition-all font-medium text-gray-800
            ${selected === opt.id ? "border-green-500 bg-green-50" : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50"}`}
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-bold mr-3">
            {opt.id.toUpperCase()}
          </span>
          {opt.text}
        </button>
      ))}
      <button
        onClick={() => onSubmit(selected)}
        disabled={!selected}
        className="mt-4 px-8 cursor-pointer py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-full transition-colors"
      >
        Submit Answer →
      </button>
    </div>
  );
}

// ─── MCQ Image ────────────────────────────────────────────────────────────────
function MCQImage({
  q,
  onSubmit,
}: {
  q: Question;
  onSubmit: (ans: string | null) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {q.options!.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={`rounded-2xl cursor-pointer overflow-hidden border-4 transition-all
              ${selected === opt.id ? "border-green-500 shadow-lg" : "border-gray-200 hover:border-green-300"}`}
          >
            {opt.image ? (
              <img
                src={opt.image}
                alt={opt.text}
                className="w-full h-32 object-contain p-3 bg-gray-50"
              />
            ) : (
              <div className="w-full h-32 flex items-center justify-center bg-gray-50 text-6xl">
                {opt.emoji}
              </div>
            )}
            <div className="py-2 px-3 text-sm font-medium text-gray-700 bg-white">
              {opt.text}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => onSubmit(selected)}
        disabled={!selected}
        className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-full transition-colors cursor-pointer"
      >
        Submit Answer →
      </button>
    </div>
  );
}

// ─── Fill Blank ───────────────────────────────────────────────────────────────
function FillBlank({
  q,
  onSubmit,
}: {
  q: Question;
  onSubmit: (ans: string) => void;
}) {
  const [value, setValue] = useState("");
  return (
    <div className="space-y-4">
      <div className="text-lg text-gray-700 leading-relaxed bg-gray-50 rounded-2xl p-5 font-medium">
        {q.question}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && value.trim() && onSubmit(value.trim())
        }
        placeholder="Type your answer here..."
        className="w-full px-5 py-3 border-2 border-gray-300 focus:border-green-500 rounded-2xl text-lg outline-none transition-colors"
      />
      <button
        onClick={() => onSubmit(value.trim())}
        disabled={!value.trim()}
        className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-full transition-colors cursor-pointer"
      >
        Submit Answer →
      </button>
    </div>
  );
}

// ─── Match Following ──────────────────────────────────────────────────────────
function MatchFollowing({
  q,
  onSubmit,
}: {
  q: Question;
  onSubmit: (ans: Record<string, string>) => void;
}) {
  const rights = q.pairs!.map((p) => p.right);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const allMapped = Object.keys(mapping).length === q.pairs!.length;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Financial Tool
          </div>
          {q.pairs!.map((pair) => (
            <div
              key={pair.left}
              className="bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 font-semibold text-blue-800"
            >
              {pair.left}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Best Used For
          </div>
          {q.pairs!.map((pair) => {
            const usedValues = Object.values(mapping).filter(
              (v) => v !== mapping[pair.left],
            );
            return (
              <select
                key={pair.left}
                value={mapping[pair.left] || ""}
                onChange={(e) =>
                  setMapping((prev) => ({
                    ...prev,
                    [pair.left]: e.target.value,
                  }))
                }
                className="w-full px-3 py-3 border-2 border-gray-300 focus:border-green-500 rounded-xl font-medium outline-none bg-white"
              >
                <option value="">-- Select --</option>
                {rights.map((r) => (
                  <option key={r} value={r} disabled={usedValues.includes(r)}>
                    {r}
                  </option>
                ))}
              </select>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => onSubmit(mapping)}
        disabled={!allMapped}
        className="px-8 py-3 cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-full transition-colors"
      >
        Submit Answer →
      </button>
    </div>
  );
}

// ─── Drag Words ───────────────────────────────────────────────────────────────
function DragWords({
  q,
  onSubmit,
}: {
  q: Question;
  onSubmit: (ans: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const [slots, setSlots] = useState<(string | null)[]>([null, null]);
  const [bank, setBank] = useState<string[]>(q.wordBank!);
  const [activeWord, setActiveWord] = useState<string | null>(null);

  const allFilled = slots.every(Boolean);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveWord(String(e.active.id).replace("word-", ""));
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveWord(null);
    const { active, over } = e;
    if (!over) return;

    const rawId = String(active.id);
    const word = rawId.replace("word-", "");
    const overId = String(over.id);

    if (overId.startsWith("slot-")) {
      const slotIdx = parseInt(overId.replace("slot-", ""));
      const fromSlotIdx = slots.findIndex((s) => s === word);
      const fromBank = bank.includes(word);

      setSlots((prev) => {
        const next = [...prev];
        const displaced = next[slotIdx];
        next[slotIdx] = word;
        if (displaced && displaced !== word) {
          setBank((b) => [...b.filter((w) => w !== word), displaced]);
        } else if (fromBank) {
          setBank((b) => b.filter((w) => w !== word));
        }
        if (fromSlotIdx !== -1 && fromSlotIdx !== slotIdx) {
          next[fromSlotIdx] = null;
        }
        return next;
      });
      return;
    }

    if (overId === "word-bank") {
      const fromSlotIdx = slots.findIndex((s) => s === word);
      if (fromSlotIdx !== -1) {
        setSlots((prev) => {
          const n = [...prev];
          n[fromSlotIdx] = null;
          return n;
        });
        setBank((b) => (b.includes(word) ? b : [...b, word]));
      }
    }
  };

  const parts = q.sentence!.split("___");

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div className="bg-gray-50 rounded-2xl p-5 text-lg leading-loose text-gray-800 font-medium">
          {parts.map((part, i) => (
            <span key={i}>
              {part}
              {i < parts.length - 1 && (
                <DroppableZone id={`slot-${i}`} highlight={!!slots[i]}>
                  <div className="min-w-[100px] text-center px-2 py-1 text-sm font-bold text-green-700">
                    {slots[i] || (
                      <span className="text-gray-400 font-normal">
                        drop here
                      </span>
                    )}
                  </div>
                </DroppableZone>
              )}
            </span>
          ))}
        </div>

        <DroppableZone id="word-bank" label="Word Bank">
          <div className="flex flex-wrap gap-3 p-1">
            {bank.map((word) => (
              <DraggableChip key={word} id={`word-${word}`} label={word} />
            ))}
            {bank.length === 0 && (
              <span className="text-gray-400 text-sm">All words placed</span>
            )}
          </div>
        </DroppableZone>

        <div className="flex gap-4">
          {slots.map((word, i) =>
            word ? (
              <DraggableChip
                key={`placed-${i}`}
                id={`word-${word}`}
                label={word}
              />
            ) : null,
          )}
        </div>
      </div>

      <DragOverlay>
        {activeWord && (
          <div className="px-4 py-2 rounded-xl border-2 border-blue-500 bg-blue-200 text-blue-900 font-bold shadow-xl">
            {activeWord}
          </div>
        )}
      </DragOverlay>

      <button
        onClick={() => onSubmit(slots as string[])}
        disabled={!allFilled}
        className="mt-6 px-8 py-3 cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-full transition-colors"
      >
        Submit Answer →
      </button>
    </DndContext>
  );
}

// ─── Category Zone ────────────────────────────────────────────────────────────
function CategoryZone({
  label,
  placedItems,
  borderColor,
  bgColor,
  textColor,
}: {
  label: string;
  placedItems: ImageItem[];
  borderColor: string;
  bgColor: string;
  textColor: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: `cat-${label}` });
  return (
    <div
      ref={setNodeRef}
      className={`min-h-[140px] rounded-2xl border-2 border-dashed p-3 transition-colors
        ${isOver ? "border-green-500 bg-green-100" : `${borderColor} ${bgColor}`}`}
    >
      <div className={`text-sm font-bold mb-2 ${textColor}`}>{label}</div>
      <div className="flex flex-wrap gap-2">
        {placedItems.map((item) => (
          <DraggableImageCard key={item.id} item={item} small />
        ))}
      </div>
    </div>
  );
}

function DraggableImageCard({
  item,
  small,
}: {
  item: ImageItem;
  small?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: item.id });
  const style = transform
    ? { transform: `translate(${transform.x}px,${transform.y}px)`, zIndex: 50 }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex flex-col items-center bg-white rounded-xl border-2 border-gray-200 select-none cursor-grab active:cursor-grabbing transition-opacity
        ${isDragging ? "opacity-0" : "opacity-100"}
        ${small ? "p-1.5 w-20" : "p-2 w-28"}`}
    >
      <img
        src={item.src}
        alt={item.label}
        className={`object-contain mb-1 ${small ? "w-10 h-10" : "w-16 h-16"}`}
      />
      <span
        className={`text-center text-gray-700 font-medium ${small ? "text-[10px]" : "text-xs"}`}
      >
        {item.label}
      </span>
    </div>
  );
}

// ─── Drag Images ──────────────────────────────────────────────────────────────
function DragImages({
  q,
  onSubmit,
}: {
  q: Question;
  onSubmit: (ans: Record<string, string>) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );
  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  const unplaced = q.imageItems!.filter((item) => !placements[item.id]);
  const allPlaced = unplaced.length === 0;

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(String(e.active.id));

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const itemId = String(active.id);
    const overId = String(over.id);

    if (overId.startsWith("cat-")) {
      const category = overId.replace("cat-", "");
      setPlacements((prev) => ({ ...prev, [itemId]: category }));
    } else if (overId === "unplaced-zone") {
      setPlacements((prev) => {
        const n = { ...prev };
        delete n[itemId];
        return n;
      });
    }
  };

  const activeItem = q.imageItems!.find((item) => item.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-5">
        <DroppableZone id="unplaced-zone" label="Drag from here:">
          <div className="flex flex-wrap gap-3 p-1 min-h-[80px]">
            {unplaced.map((item) => (
              <DraggableImageCard key={item.id} item={item} />
            ))}
            {unplaced.length === 0 && (
              <span className="text-gray-400 text-sm self-center">
                All items placed!
              </span>
            )}
          </div>
        </DroppableZone>

        <div className="grid grid-cols-2 gap-4">
          {q.imageCategories!.map((cat) => {
            const placedItems = q.imageItems!.filter(
              (item) => placements[item.id] === cat.label,
            );
            const borderColor =
              cat.label === "Savings Account"
                ? "border-green-400"
                : "border-orange-400";
            const bgColor =
              cat.label === "Savings Account" ? "bg-green-50" : "bg-orange-50";
            const textColor =
              cat.label === "Savings Account"
                ? "text-green-700"
                : "text-orange-700";
            return (
              <CategoryZone
                key={cat.label}
                label={cat.label}
                placedItems={placedItems}
                borderColor={borderColor}
                bgColor={bgColor}
                textColor={textColor}
              />
            );
          })}
        </div>
      </div>

      <DragOverlay>
        {activeItem && (
          <div className="flex flex-col items-center bg-white rounded-xl p-2 shadow-2xl border-2 border-green-400 w-28 opacity-90">
            <img
              src={activeItem.src}
              alt={activeItem.label}
              className="w-14 h-14 object-contain mb-1"
            />
            <span className="text-xs text-center text-gray-700 font-medium">
              {activeItem.label}
            </span>
          </div>
        )}
      </DragOverlay>

      <button
        onClick={() => onSubmit(placements)}
        disabled={!allPlaced}
        className="mt-6 px-8 py-3 cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold rounded-full transition-colors"
      >
        Submit Answer →
      </button>
    </DndContext>
  );
}

// ─── Certificate Preview (Beautified) ────────────────────────────────────────
function CertificatePreview({
  name,
  score,
  total,
  date,
}: {
  name: string;
  score: number;
  total: number;
  date: string;
}) {
  const certStyles: Record<string, React.CSSProperties> = {
    page: {
      width: 860,
      minHeight: 580,
      background:
        "linear-gradient(145deg, #faf8f2 0%, #f5f0e8 50%, #faf8f2 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 8px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
    },
    borderOuter: {
      position: "absolute",
      inset: 10,
      border: "2px solid #8B6914",
      borderRadius: 3,
      pointerEvents: "none",
    },
    borderInner: {
      position: "absolute",
      inset: 16,
      border: "0.5px solid rgba(139,105,20,0.4)",
      borderRadius: 2,
      pointerEvents: "none",
    },
    content: {
      position: "relative",
      padding: "44px 72px 40px",
      zIndex: 1,
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      marginBottom: 4,
    },
    orgName: {
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: "0.35em",
      color: "#1a5c32",
      textTransform: "uppercase" as const,
      fontFamily: "'Georgia', serif",
      display: "block",
      lineHeight: 1.3,
      textAlign: "center" as const,
    },
    orgSub: {
      fontSize: 9.5,
      letterSpacing: "0.3em",
      color: "#8B6914",
      textTransform: "uppercase" as const,
      fontFamily: "'Georgia', serif",
      display: "block",
      marginTop: 2,
      textAlign: "center" as const,
    },
    dividerRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      margin: "14px 0",
    },
    dividerLine: {
      flex: 1,
      height: 1,
      background: "#c9a227",
      opacity: 0.4,
    },
    eyebrow: {
      fontSize: 9,
      letterSpacing: "0.45em",
      color: "#8B6914",
      textTransform: "uppercase" as const,
      textAlign: "center" as const,
      display: "block",
      marginBottom: 8,
      fontFamily: "'Georgia', serif",
    },
    headline: {
      fontSize: 28,
      fontWeight: 400,
      color: "#1a2e1e",
      textAlign: "center" as const,
      margin: 0,
      fontFamily: "'Georgia', serif",
      letterSpacing: "0.03em",
    },
    recipientName: {
      fontSize: 60,
      fontWeight: 400,
      fontStyle: "italic",
      color: "#1a5c32",
      textAlign: "center" as const,
      margin: "14px 0 6px",
      fontFamily: "'Georgia', serif",
      letterSpacing: "0.02em",
      lineHeight: 1.1,
    },
    nameUnderline: {
      width: 360,
      margin: "8px auto 20px",
      height: "1.5px",
      background: "#c9a227",
      opacity: 0.5,
    },
    bodyText: {
      fontSize: 16,
      fontWeight: 400,
      color: "#2d3b32",
      textAlign: "center" as const,
      lineHeight: 1.9,
      margin: "0 0 4px",
      fontFamily: "'Georgia', serif",
    },
    courseName: {
      fontSize: 21,
      fontWeight: 700,
      color: "#1a5c32",
      fontFamily: "'Georgia', serif",
    },
    scoresRow: {
      display: "flex",
      justifyContent: "center",
      margin: "22px 0 20px",
    },
    scoreBlock: {
      textAlign: "center" as const,
      padding: "14px 36px",
      position: "relative" as const,
      borderTop: "1px solid rgba(139,105,20,0.3)",
      borderBottom: "1px solid rgba(139,105,20,0.3)",
    },
    scoreValue: {
      fontSize: 34,
      fontWeight: 700,
      color: "#1a5c32",
      fontFamily: "'Georgia', serif",
      display: "block",
      lineHeight: 1,
    },
    scoreLabel: {
      fontSize: 9,
      letterSpacing: "0.3em",
      color: "#8B6914",
      textTransform: "uppercase" as const,
      fontFamily: "'Georgia', serif",
      display: "block",
      marginTop: 5,
    },
    footer: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginTop: 18,
      paddingTop: 16,
      borderTop: "0.5px solid rgba(139,105,20,0.3)",
    },
    sigBlock: {
      textAlign: "center" as const,
      minWidth: 160,
    },
    sigLine: {
      width: 160,
      height: 1,
      background: "rgba(139,105,20,0.5)",
      marginBottom: 6,
    },
    sigLabel: {
      fontSize: 9,
      letterSpacing: "0.25em",
      color: "#8B6914",
      textTransform: "uppercase" as const,
      fontFamily: "'Georgia', serif",
      display: "block",
    },
    sigValue: {
      fontSize: 13,
      fontWeight: 700,
      color: "#1a5c32",
      fontFamily: "'Georgia', serif",
      display: "block",
      marginTop: 2,
    },
  };

  // Corner SVG ornament
  const CornerOrnament = ({
    style,
    flip,
  }: {
    style: React.CSSProperties;
    flip?: { x?: boolean; y?: boolean };
  }) => (
    <svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      style={{ position: "absolute", ...style }}
    >
      <g
        transform={`${flip?.x ? "scale(-1,1) translate(-56,0)" : ""} ${flip?.y ? "scale(1,-1) translate(0,-56)" : ""}`}
      >
        <path
          d="M2 22 L2 2 L22 2"
          stroke="#8B6914"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M2 14 L2 2 L14 2"
          stroke="#8B6914"
          strokeWidth="0.5"
          fill="none"
          opacity="0.45"
        />
        <circle cx="2" cy="2" r="2.5" fill="#8B6914" opacity="0.65" />
      </g>
    </svg>
  );

  // Seal SVG
  const Seal = () => (
    <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
      <circle
        cx="44"
        cy="44"
        r="40"
        stroke="#8B6914"
        strokeWidth="1.2"
        fill="rgba(250,248,242,0.95)"
      />
      <circle
        cx="44"
        cy="44"
        r="34"
        stroke="#8B6914"
        strokeWidth="0.5"
        fill="none"
        strokeDasharray="3.5 2.5"
        opacity="0.55"
      />
      <circle
        cx="44"
        cy="44"
        r="27"
        stroke="#8B6914"
        strokeWidth="0.8"
        fill="rgba(26,92,50,0.05)"
      />
      {/* Trophy cup */}
      <path
        d="M36 30 L36 42 Q36 49 44 49 Q52 49 52 42 L52 30 Z"
        fill="#8B6914"
        opacity="0.82"
      />
      <rect x="41" y="49" width="6" height="6" fill="#8B6914" opacity="0.72" />
      <rect
        x="36"
        y="55"
        width="16"
        height="3"
        rx="1.5"
        fill="#8B6914"
        opacity="0.78"
      />
      <path
        d="M36 33 Q28 33 28 40 Q28 45 36 47"
        stroke="#8B6914"
        strokeWidth="1.8"
        fill="none"
        opacity="0.65"
      />
      <path
        d="M52 33 Q60 33 60 40 Q60 45 52 47"
        stroke="#8B6914"
        strokeWidth="1.8"
        fill="none"
        opacity="0.65"
      />
      {/* Star top */}
      <path
        d="M44 22 L45.2 26 L49.5 26 L46.1 28.4 L47.4 32.5 L44 30 L40.6 32.5 L41.9 28.4 L38.5 26 L42.8 26 Z"
        fill="#8B6914"
        opacity="0.7"
      />
      {/* Bottom text */}
      <text
        x="44"
        y="75"
        fontSize="7"
        fill="#8B6914"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        letterSpacing="2"
        opacity="0.8"
      >
        CERTIFIED
      </text>
    </svg>
  );

  // Diamond ornament divider
  const DiamondDivider = () => (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path
        d="M8 1 L10 6.5 L15.5 8 L10 9.5 L8 15 L6 9.5 L0.5 8 L6 6.5 Z"
        fill="#8B6914"
      />
    </svg>
  );

  return (
    <div id="certificate-canvas" style={certStyles.page}>
      {/* Borders */}
      <div style={certStyles.borderOuter} />
      <div style={certStyles.borderInner} />

      {/* Corner ornaments */}
      <CornerOrnament style={{ top: 7, left: 7 }} />
      <CornerOrnament style={{ top: 7, right: 7 }} flip={{ x: true }} />
      <CornerOrnament style={{ bottom: 7, left: 7 }} flip={{ y: true }} />
      <CornerOrnament
        style={{ bottom: 7, right: 7 }}
        flip={{ x: true, y: true }}
      />

      <div style={certStyles.content}>
        {/* Header */}
        <div style={certStyles.header}>
          {/* Left leaf icon */}
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <ellipse
              cx="22"
              cy="30"
              rx="9"
              ry="5"
              fill="#1a5c32"
              opacity="0.12"
            />
            <path
              d="M22 37 Q22 27 22 19"
              stroke="#1a5c32"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M22 25 Q16 19 12 15 Q16 13 20 17 Q22 19 22 25"
              fill="#2d7a45"
              opacity="0.88"
            />
            <path
              d="M22 29 Q28 21 32 16 Q28 14 25 18 Q22 21 22 29"
              fill="#1a5c32"
            />
            <path
              d="M22 33 Q18 27 14 25 Q15 22 19 24 Q21 26 22 33"
              fill="#2d7a45"
              opacity="0.65"
            />
          </svg>

          <div style={{ textAlign: "center" }}>
            <span style={certStyles.orgName}>Green Sapling</span>
            <span style={certStyles.orgSub}>Financial Literacy Program</span>
          </div>

          {/* Right gold leaf icon */}
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            style={{ flexShrink: 0 }}
          >
            <ellipse
              cx="22"
              cy="30"
              rx="9"
              ry="5"
              fill="#8B6914"
              opacity="0.1"
            />
            <path
              d="M22 37 Q22 27 22 19"
              stroke="#8B6914"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M22 25 Q28 19 32 15 Q28 13 24 17 Q22 19 22 25"
              fill="#c9a227"
              opacity="0.8"
            />
            <path
              d="M22 29 Q16 21 12 16 Q16 14 19 18 Q22 21 22 29"
              fill="#8B6914"
            />
            <path
              d="M22 33 Q26 27 30 25 Q29 22 25 24 Q23 26 22 33"
              fill="#c9a227"
              opacity="0.65"
            />
          </svg>
        </div>

        {/* Divider 1 */}
        <div style={certStyles.dividerRow}>
          <div style={certStyles.dividerLine} />
          <DiamondDivider />
          <div style={certStyles.dividerLine} />
        </div>

        {/* Eyebrow + headline */}
        <span style={certStyles.eyebrow}>Certificate of Completion</span>
        <h1 style={certStyles.headline}>This is to certify that</h1>

        {/* Name */}
        <div style={certStyles.recipientName}>{name}</div>
        <br />
        <div style={certStyles.nameUnderline} />

        {/* Body */}
        <p style={certStyles.bodyText}>
          has successfully completed the
          <br />
          <span style={certStyles.courseName}>
            Financial Foundations Course
          </span>
          <br />
          including all lessons, simulations, and the Final Quiz
        </p>

        {/* Divider 2 */}
        <div style={{ ...certStyles.dividerRow, margin: "16px 0 12px" }}>
          <div style={certStyles.dividerLine} />
          <svg width="8" height="8" viewBox="0 0 8 8">
            <circle cx="4" cy="4" r="3" fill="#8B6914" opacity="0.55" />
          </svg>
          <div style={certStyles.dividerLine} />
        </div>

        {/* Score — single line */}
        <div
          style={{
            textAlign: "center",
            margin: "20px 0 18px",
            fontSize: 18,
            color: "#2d3b32",
            fontFamily: "'Georgia', serif",
            letterSpacing: "0.02em",
          }}
        >
          Score:{" "}
          <span style={{ fontWeight: 700, color: "#1a5c32" }}>
            {score} out of {total}
          </span>
        </div>

        {/* Footer */}
        <div style={certStyles.footer}>
          <div style={certStyles.sigBlock}>
            <div style={certStyles.sigLine} />
            <span style={certStyles.sigLabel}>Date of Issue</span>
            <span style={certStyles.sigValue}>{date}</span>
          </div>

          <Seal />

          <div style={{ ...certStyles.sigBlock, textAlign: "right" }}>
            <div style={{ ...certStyles.sigLine, marginLeft: "auto" }} />
            <span style={certStyles.sigLabel}>Issued by</span>
            <span style={certStyles.sigValue}>Green Sapling</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Score Screen ─────────────────────────────────────────────────────────────
function ScoreScreen({
  score,
  total,
  onContinue,
}: {
  score: number;
  total: number;
  onContinue: () => void;
}) {
  const pct = Math.round((score / total) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 60 ? "🎉" : "💪";
  const msg =
    pct >= 80
      ? "Outstanding! You're a financial pro!"
      : pct >= 60
        ? "Great job! Keep learning!"
        : "Good effort! Keep it up!";

  const [step, setStep] = useState<"score" | "name" | "preview">("score");
  const [name, setName] = useState("");
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [xpEvent, setXpEvent] = useState<{ label: string; xp: number } | null>(
    null,
  );
  const today = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleDownload = async () => {
    const el = document.getElementById("certificate-canvas");
    if (!el) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#faf8f2",
        logging: false,
        imageTimeout: 0,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2],
      });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`GreenSapling_Certificate_${name.replace(/\s+/g, "_")}.pdf`);
      // Award 50 XP for downloading certificate
      setXpEvent({ label: "Certificate downloaded!", xp: 50 });
    } catch (err) {
      console.error("Certificate download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
      {/* XP Toast */}
      {xpEvent && (
        <XPToast
          label={xpEvent.label}
          xp={xpEvent.xp}
          onDone={() => setXpEvent(null)}
        />
      )}
      {/* ── Step 1: Score ── */}
      {step === "score" && (
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-green-200">
          <div className="text-7xl mb-4">{emoji}</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Quiz Complete!
          </h2>
          <p className="text-gray-500 mb-8">{msg}</p>

          {/* Score ring */}
          <div className="relative w-36 h-36 mx-auto mb-6">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke={
                  pct >= 80 ? "#16a34a" : pct >= 60 ? "#f59e0b" : "#ef4444"
                }
                strokeWidth="3"
                strokeDasharray={`${pct} ${100 - pct}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{score}</span>
              <span className="text-xs text-gray-500">out of {total}</span>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 mb-8">
            <div className="text-3xl font-bold text-green-700">{pct}%</div>
            <div className="text-sm text-green-600 mt-1">Final Score</div>
          </div>

          <button
            onClick={() => setStep("name")}
            className="w-full py-4 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-2xl transition-colors mb-3"
          >
            🎓 Generate Certificate
          </button>
          <button
            onClick={onContinue}
            className="w-full py-3 cursor-pointer border-2 border-green-300 text-green-700 font-semibold rounded-2xl hover:bg-green-50 transition-colors"
          >
            Back to Course
          </button>
        </div>
      )}

      {/* ── Step 2: Enter Name ── */}
      {step === "name" && (
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-green-200">
          <div className="text-6xl mb-4">✍️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            What name should appear on your certificate?
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Enter your full name exactly as you'd like it printed.
          </p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && name.trim() && setStep("preview")
            }
            placeholder="e.g. Arjun Sharma"
            className="w-full px-5 py-4 border-2 border-gray-300 focus:border-green-500 rounded-2xl text-xl text-center outline-none transition-colors mb-6"
            autoFocus
          />
          <button
            onClick={() => setStep("preview")}
            disabled={!name.trim()}
            className="w-full py-4 cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white font-bold text-lg rounded-2xl transition-colors mb-3"
          >
            Preview Certificate →
          </button>
          <button
            onClick={() => setStep("score")}
            className="w-full py-3 cursor-pointer border-2 border-gray-200 text-gray-500 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        </div>
      )}

      {/* ── Step 3: Preview + Download ── */}
      {step === "preview" && (
        <div className="w-full max-w-5xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              Your Certificate is Ready! Download it as PDF
            </h2>
          </div>

          {/* Centered scrollable certificate container */}
          <div className="flex justify-center mb-6 overflow-x-auto">
            <div
              ref={certRef}
              className="rounded-2xl shadow-2xl border-4 border-amber-200 shrink-0"
              style={{ lineHeight: 1 }}
            >
              <CertificatePreview
                name={name.trim()}
                score={score}
                total={total}
                date={today}
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-10 py-4 cursor-pointer bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold text-lg rounded-2xl transition-colors shadow-lg"
            >
              {downloading ? "⏳ Generating PDF..." : "⬇️ Download Certificate"}
            </button>
            <button
              onClick={() => setStep("name")}
              className="px-8 py-4 cursor-pointer border-2 border-gray-300 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              ← Edit Name
            </button>
            <button
              onClick={onContinue}
              className="px-8 py-4 cursor-pointer border-2 border-green-300 text-green-700 font-semibold rounded-2xl hover:bg-green-50 transition-colors"
            >
              Back to Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FinalQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();

  const isEducator = location.pathname.startsWith("/educator");
  const basePath = isEducator ? "/educator" : "/student";

  const [currentIdx, setCurrentIdx] = useState(0);
  const [questionKey, setQuestionKey] = useState(0);
  const [answers, setAnswers] = useState<
    { q: Question; userAnswer: unknown; correct: boolean }[]
  >([]);
  const [finished, setFinished] = useState(false);
  const [xpEvent, setXpEvent] = useState<{ label: string; xp: number } | null>(
    null,
  );

  const q = questions[currentIdx];

  const handleSubmit = (userAnswer: unknown) => {
    const correct = checkAnswer(q, userAnswer);
    const newAnswers = [...answers, { q, userAnswer, correct }];
    setAnswers(newAnswers);
    // Award 10 XP per question answered
    setXpEvent({ label: `Quiz Q${currentIdx + 1} answered`, xp: 10 });

    if (currentIdx + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIdx((i) => i + 1);
      setQuestionKey((k) => k + 1);
    }
  };

  const score = answers.filter((a) => a.correct).length;

  if (finished) {
    return (
      <ScoreScreen
        score={score}
        total={questions.length}
        onContinue={() =>
          navigate(`${basePath}/course/${courseId}`, {
            state: { completedLevel: 3 },
          })
        }
      />
    );
  }

  const typeLabel: Record<QuestionType, string> = {
    "mcq-text": "Multiple Choice",
    "mcq-image": "Image Choice",
    "fill-blank": "Fill in the Blank",
    match: "Match the Following",
    "drag-words": "Drag & Drop Words",
    "drag-images": "Drag & Drop Images",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-emerald-100">
      {isEducator ? <EducatorHeader /> : <StudentHeader />}

      {/* XP Toast */}
      {xpEvent && (
        <XPToast
          label={xpEvent.label}
          xp={xpEvent.xp}
          onDone={() => setXpEvent(null)}
        />
      )}

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>
              Question {currentIdx + 1} of {questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(currentIdx / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-green-100 overflow-hidden">
          <div className="bg-linear-to-r from-green-600 to-emerald-500 px-8 py-5">
            <div className="flex items-center justify-between">
              <span className="text-green-100 text-sm font-semibold uppercase tracking-wider">
                {typeLabel[q.type]}
              </span>
              <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">
                Q{q.id}
              </span>
            </div>
            <h2 className="text-white text-xl font-bold mt-3 leading-snug">
              {q.question}
            </h2>
          </div>

          <div className="px-8 py-7" key={questionKey}>
            {q.type === "mcq-text" && <MCQText q={q} onSubmit={handleSubmit} />}
            {q.type === "mcq-image" && (
              <MCQImage q={q} onSubmit={handleSubmit} />
            )}
            {q.type === "fill-blank" && (
              <FillBlank q={q} onSubmit={handleSubmit} />
            )}
            {q.type === "match" && (
              <MatchFollowing q={q} onSubmit={handleSubmit} />
            )}
            {q.type === "drag-words" && (
              <DragWords q={q} onSubmit={handleSubmit} />
            )}
            {q.type === "drag-images" && (
              <DragImages q={q} onSubmit={handleSubmit} />
            )}
          </div>
        </div>

        <div className="text-center mt-4 flex gap-4 justify-center">
          <button
            onClick={() => handleSubmit(null)}
            className="text-lg text-black font-semibold hover:text-gray-600 underline cursor-pointer"
          >
            Skip this question
          </button>
        </div>
      </div>
    </div>
  );
}
