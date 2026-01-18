import React from 'react';
import { Link } from 'react-router-dom';
import './Solana.css';

function Solana() {
  return (
    <div className="solana-page">
      <div className="solana-hero">
        <h1>Why SlugBites Uses Solana</h1>
        <p className="subtitle">Fast, Efficient, and Scalable Payments for UCSC Students</p>
      </div>

      <div className="solana-content">
        <section className="solana-section">
          <h2>🚀 Built for Speed and Scale</h2>
          <p>
            The world of development is evolving fast, and Solana is leading the charge with a network 
            built to handle all of your infrastructure needs. Forget high fees and slow confirmations—it's 
            time to build applications that are fast, efficient, and scalable.
          </p>
        </section>

        <section className="solana-section">
          <h2>⚡ Blazing Fast Execution</h2>
          <p>
            Solana's core advantages include blazing fast execution and near-zero transaction costs. 
            When you're ordering food between classes or during a quick study break, you need payments 
            that process instantly—not transactions that take minutes or cost significant fees.
          </p>
          <div className="feature-box">
            <strong>Instant Transactions:</strong> Your payment processes in seconds, not minutes
          </div>
        </section>

        <section className="solana-section">
          <h2>💰 Near-Zero Transaction Costs</h2>
          <p>
            Traditional payment processors charge fees that eat into your meal budget. With Solana, 
            transaction fees are fractions of a cent, meaning more of your money goes to food, not fees.
          </p>
          <div className="feature-box">
            <strong>Cost Savings:</strong> Pay less than $0.001 per transaction vs. traditional 2-3% fees
          </div>
        </section>

        <section className="solana-section">
          <h2>🎓 Real-World Value for Students</h2>
          <p>
            As UCSC students, you're preparing for the real world. Learning to use modern payment 
            technologies like Solana gives you practical experience with cutting-edge blockchain 
            infrastructure that's being adopted by major companies worldwide.
          </p>
          <div className="feature-box">
            <strong>Future-Proof Skills:</strong> Gain hands-on experience with technology used by 
            Fortune 500 companies and innovative startups
          </div>
        </section>

        <section className="solana-section">
          <h2>🍽️ Perfect for Flexible Meal Plans</h2>
          <p>
            Not everyone uses all their meal swipes or dining credits. With Solana, you can easily 
            pay for individual meals without being locked into rigid meal plans. This flexibility 
            means you only pay for what you actually eat, making it perfect for students with varying 
            schedules and dietary needs.
          </p>
          <div className="feature-box">
            <strong>Flexibility:</strong> Pay per meal instead of committing to expensive meal plans 
            you might not fully use
          </div>
        </section>

        <section className="solana-section">
          <h2>🌐 High-Frequency, Real-World Ready</h2>
          <p>
            SlugBites leverages Solana's ability to handle instant, high-frequency transactions—perfect 
            for a food delivery service that needs to process hundreds of orders during peak meal times. 
            Whether it's breakfast rush, lunch between classes, or late-night study snacks, Solana 
            ensures smooth, instant payments.
          </p>
        </section>

        <section className="solana-section">
          <h2>🏆 MLH Best Use of Solana Prize Track</h2>
          <p>
            SlugBites is built for the <strong>MLH Best Use of Solana</strong> prize track, demonstrating 
            how Solana's infrastructure can power real-world consumer applications. We're showing how 
            blockchain technology can solve everyday problems—making food delivery faster, cheaper, and 
            more accessible for students.
          </p>
        </section>

        <section className="solana-section highlight">
          <h2>💡 The Future of Payments</h2>
          <p>
            With Solana, the possibilities are endless. We're building a prototype that can handle 
            massive, real-world volume while keeping costs low and transactions instant. This isn't 
            just a hackathon project—it's a glimpse into the future of how we'll pay for everyday 
            services.
          </p>
        </section>

        <div className="solana-cta">
          <Link to="/menu" className="cta-button">
            Start Ordering with Solana →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Solana;

