import Hero from "@/components/Hero";
import NewArrivals from "@/components/NewArrivals";

export default function Home() {
    return (
        <main>
            {/* මුළු පිටුවේම උඩින්ම Hero Section එක විතරක් පෙන්වනවා */}
            <Hero />
            {/* Latest 4 Products Section */}
            <NewArrivals />

            {/* ඔයාට මොනවා හරි අමතර විස්තරයක් පසුව දාන්න ඕනේ නම් මෙතනින් පටන් ගන්න පුළුවන් */}
            {/* <div className="max-w-7xl mx-auto p-10">
          ...
      </div> */}
        </main>
    );
}