import AddToyClient from "@/components/toybox/AddToyClient";

export const metadata = {
  title: "My Toys — ToyBox",
};

export default function MyToysPage() {
  return (
    <div className="w-full">
      <AddToyClient />
    </div>
  );
}
