'use client'

export default function About() {
  return (
    <div className="card-elevated p-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-black">About Leadger</h2>

      <p className="text-lg text-muted-foreground">
        <strong>Leadger empowers ethical, profit-smart choices.</strong> We connect people with companies that truly align with their political, social, and economic values—making it easier than ever to spend with purpose.
      </p>

      <p className="text-lg text-muted-foreground">
        Many consumers feel overwhelmed trying to find products, services, or investments that reflect what matters most to them. Leadger ends that frustration by providing clear, actionable insights and personalized recommendations. Whether you're shopping, investing, or advocating, we help you lead your spending and influence real change.
      </p>

      <p className="text-lg text-muted-foreground">
        Our platform analyzes complex corporate and consumer data, working with data brokers, advocacy groups, and ethical brands to deliver meaningful matches and alternatives. At the same time, we offer businesses valuable insights into consumer sentiment, transparency metrics, and stock forecasts—driving accountability and impact.
      </p>

      <h3 className="text-2xl font-semibold text-black">Our Mission</h3>
      <p className="text-lg text-muted-foreground">
        To make ethical consumerism simple, profitable, and powerful—for individuals, companies, and communities.
      </p>

      <h3 className="text-2xl font-semibold text-black">Aligned with UN SDGs</h3>
      <ul className="list-disc list-inside text-lg text-muted-foreground space-y-1">
        <li><strong>Goal 12:</strong> Responsible Consumption and Production</li>
        <li><strong>Goal 8:</strong> Decent Work and Economic Growth</li>
      </ul>

      <p className="text-xl text-center text-orange-500 font-semibold mt-6">
        Join us. Lead your spending. Influence change.
      </p>
    </div>
  )
}