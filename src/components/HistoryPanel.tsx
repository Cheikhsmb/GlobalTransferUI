import { motion } from 'framer-motion';
import { Activity, Clock3, ExternalLink } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';

const SEPOLIA_EXPLORER = 'https://sepolia.etherscan.io/tx';

export function HistoryPanel() {
  const transactions = useAppStore((s) => s.transactions);

  return (
    <Card className="history-panel">
      <div className="history-panel__header">
        <div>
          <p className="eyebrow">Historique on-chain</p>
          <h3>Journal des transferts internationaux</h3>
        </div>
        <div className="history-tag">
          <Activity size={16} />
          <span>Traçabilité immuable</span>
        </div>
      </div>

      <div className="history-list">
        {transactions.length === 0 && (
          <p style={{ color: '#888', fontSize: '0.9rem', padding: '1rem 0' }}>
            Aucun transfert trouvé. Connectez votre portefeuille pour charger l'historique.
          </p>
        )}
        {transactions.map((transaction, index) => (
          <motion.article
            key={transaction.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: 'easeOut' }}
            className="history-item"
          >
            <div className="history-item__line">
              <span>{Number(transaction.amount).toLocaleString('fr-FR')} {transaction.sourceCurrency} → {transaction.targetCurrency}</span>
              <strong style={{ color: transaction.status === 'Confirmé' ? '#00e5ff' : '#fbbf24' }}>
                {transaction.status}
              </strong>
            </div>
            <div className="history-item__line">
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }}>
                Dest. : {transaction.recipient.slice(0, 10)}…{transaction.recipient.slice(-6)}
              </span>
              <span className="history-time">
                <Clock3 size={14} /> {transaction.date}
              </span>
            </div>
            {transaction.txHash && (
              <div className="history-item__meta">
                <a
                  href={`${SEPOLIA_EXPLORER}/${transaction.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#00e5ff', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}
                >
                  <ExternalLink size={11} />
                  {transaction.txHash.slice(0, 12)}…{transaction.txHash.slice(-6)}
                </a>
              </div>
            )}
          </motion.article>
        ))}
      </div>
    </Card>
  );
}
