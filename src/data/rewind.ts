export type Scene =
  | { id: string; kind: "open"; kicker: string; title: string; line: string; hint: string }
  | { id: string; kind: "total"; label: string; amount: number; delta: string; note: string }
  | {
      id: string;
      kind: "categories";
      label: string;
      items: { name: string; amount: number; count: number }[];
    }
  | {
      id: string;
      kind: "moment";
      label: string;
      time: string;
      date: string;
      place: string;
      amount: number;
      note: string;
    }
  | {
      id: string;
      kind: "saving";
      label: string;
      amount: number;
      months: boolean[];
      note: string;
    }
  | { id: string; kind: "cashback"; label: string; amount: number; rank: string; note: string }
  | {
      id: string;
      kind: "persona";
      label: string;
      persona: string;
      blurb: string;
      stats: { k: string; v: string }[];
    };

/** Dữ liệu minh hoạ — không phải số liệu tài khoản thật. */
export const scenes: Scene[] = [
  {
    id: "open",
    kind: "open",
    kicker: "Techcombank",
    title: "Rewind 2026",
    line: "1.284 lần chạm, 12 tháng, một bức chân dung tài chính.",
    hint: "Chạm để đi tiếp",
  },
  {
    id: "total",
    kind: "total",
    label: "Bạn đã chi trong năm 2026",
    amount: 428650000,
    delta: "Nhiều hơn 2025 12%",
    note: "Tháng 9 là tháng tốn kém nhất: 52.310.000 ₫.",
  },
  {
    id: "categories",
    kind: "categories",
    label: "Tiền đi về đâu",
    items: [
      { name: "Ăn uống", amount: 96420000, count: 412 },
      { name: "Mua sắm", amount: 78150000, count: 186 },
      { name: "Di chuyển", amount: 41870000, count: 298 },
      { name: "Du lịch", amount: 38900000, count: 11 },
      { name: "Hoá đơn", amount: 29640000, count: 96 },
    ],
  },
  {
    id: "moment",
    kind: "moment",
    label: "Giao dịch muộn nhất của bạn",
    time: "3:47 sáng",
    date: "Thứ Bảy, 14 tháng 7",
    place: "Phở Lệ — Quận 5, TP.HCM",
    amount: 65000,
    note: "Đêm đó bạn không phải người duy nhất. 4.061 người khác cũng quẹt thẻ sau 3 giờ sáng.",
  },
  {
    id: "saving",
    kind: "saving",
    label: "Bạn đã để dành được",
    amount: 96400000,
    months: [true, true, false, true, true, true, true, false, true, true, true, true],
    note: "10 trên 12 tháng có tiền chuyển vào Tiết kiệm.",
  },
  {
    id: "cashback",
    kind: "cashback",
    label: "Hoàn tiền về ví bạn",
    amount: 4128000,
    rank: "Top 8% hạng Inspire",
    note: "Bằng 63 ly cà phê, hoặc một chuyến bay Hà Nội – Đà Nẵng.",
  },
  {
    id: "persona",
    kind: "persona",
    label: "Chân dung 2026 của bạn",
    persona: "Người Săn Hoàn Tiền",
    blurb: "Chi có kế hoạch, luôn chọn đúng thẻ, và không bỏ lỡ một ưu đãi nào.",
    stats: [
      { k: "Giao dịch", v: "1.284" },
      { k: "Hoàn tiền", v: "4,1 triệu ₫" },
      { k: "Để dành", v: "96,4 triệu ₫" },
    ],
  },
];

export const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n);
