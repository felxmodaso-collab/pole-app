import Canvas from "@/components/Canvas";
import ConstellationLayer from "@/components/ConstellationLayer";
import Hud from "@/components/Hud";
import Minimap from "@/components/Minimap";
import MobileStack from "@/components/MobileStack";
import SearchOverlay from "@/components/SearchOverlay";
import WaitlistMount from "@/components/WaitlistMount";
import ZoneEntry from "@/components/zones/ZoneEntry";
import ZoneProblem from "@/components/zones/ZoneProblem";
import ZoneArtifact from "@/components/zones/ZoneArtifact";
import ZoneMechanisms from "@/components/zones/ZoneMechanisms";
import ZoneTest from "@/components/zones/ZoneTest";
import ZonePricing from "@/components/zones/ZonePricing";
import ZoneFaq from "@/components/zones/ZoneFaq";
import ZoneAbout from "@/components/zones/ZoneAbout";

const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Чем Поле отличается от Notion / Obsidian / Scrivener?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Три приложения — три частичных ответа. Notion держит базу данных, но плоско. Obsidian сильный в связях, но не держит аргумент длиной в главу. Scrivener держит структуру, но источники живут отдельно. Поле собрано вокруг одной задачи — не потерять нить за 14 месяцев работы.",
      },
    },
    {
      "@type": "Question",
      name: "Что будет с данными, если Поле закроется?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "За 90 дней до shutdown — исходники в open-source (MIT). За 60 дней — self-host инструкции и Docker-образ. За 30 дней — автоматический экспорт всем активным пользователям. Это записано в Terms пункт 7.",
      },
    },
    {
      "@type": "Question",
      name: "Используете мои тексты для тренировки AI?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Нет. Никогда. Никаких opt-in, никаких галочек в настройках. Текст не передаётся OpenAI, Anthropic, Google, или нам самим как «анонимизированные данные».",
      },
    },
    {
      "@type": "Question",
      name: "Почему $12/мес, а не бесплатный тир?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Бесплатные тиры часто это data hostage — через 2 года предложат платить, иначе экспорт закроется. Мы не идём в эту модель. Trial 14 дней без карты — чтобы не было «не попробовал».",
      },
    },
    {
      "@type": "Question",
      name: "Будет ли iPad приложение?",
      acceptedAnswer: {
        "@type": "Answer",
        text:
          "Web-версия работает в Safari на iPad. Нативный iPad — в roadmap на Q3 2026, с Apple Pencil. iOS mobile — нет: писать длинный нон-фикшн с телефона никто не пытается всерьёз.",
      },
    },
  ],
};

const LD_JSON = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Поле",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  description:
    "Инструмент для длинного нон-фикшн: источники, аргумент, черновики глав и связи между ними — в одном холсте.",
  offers: [
    {
      "@type": "Offer",
      name: "Personal",
      price: "12",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "12",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
    },
    {
      "@type": "Offer",
      name: "Academic",
      price: "60",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "60",
        priceCurrency: "USD",
        unitText: "YEAR",
      },
    },
    {
      "@type": "Offer",
      name: "Trial",
      price: "0",
      priceCurrency: "USD",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LD_JSON) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD) }}
      />
      <main id="main" aria-label="Поле — холст">
        {/* Desktop: infinite canvas */}
        <Canvas
          overlay={
            <>
              <ConstellationLayer />
              <Hud />
              <Minimap />
              <SearchOverlay />
            </>
          }
        >
          <ZoneEntry />
          <ZoneProblem />
          <ZoneArtifact />
          <ZoneMechanisms />
          <ZoneTest />
          <ZonePricing />
          <ZoneFaq />
          <ZoneAbout />
        </Canvas>

        {/* Mobile: vertical stack */}
        <MobileStack />
      </main>
      {/* Global waitlist modal — listens for openWaitlist() events. */}
      <WaitlistMount />
    </>
  );
}
