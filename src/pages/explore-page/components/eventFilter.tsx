type EventFilterProps = {
  category: string;
  setCategory: (val: string) => void;
  location: string;
  setLocation: (val: string) => void;
};

export default function EventFilter({
  category, setCategory,
  location, setLocation
}: EventFilterProps) {
  return (
    <div className="flex gap-4 mb-6">
      <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded">
        <option value="">Semua Kategori</option>
        <option value="music">Musik</option>
        <option value="fashion">Fashion</option>
        <option value="sport">Sport</option>
        <option value="politik">politik</option>
      </select>

      <select value={location} onChange={(e) => setLocation(e.target.value)} className="border p-2 rounded">
        <option value="">Semua Lokasi</option>
        <option value="Jakarta">Jakarta</option>
        <option value="Bandung">Bandung</option>
        <option value="Bali">Bali</option>
        <option value="Bandar Lampung">Bandar Lampung</option>
      </select>
    </div>
  );
}
