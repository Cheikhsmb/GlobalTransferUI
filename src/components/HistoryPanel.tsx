import { motion } from 'framer-motion';
import { Activity, Clock3 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { Card } from '@/components/ui/card';

export function HistoryPanel() {
  const transactions = useAppStore((s) => s.transactions);

  return (
    <Card className="history-panel">
      <div className="history-panel__header">
        <div>
          <p className="eyebrow">Historique simulé</p>
          <h3>Journal des transferts internationaux</h3>
        </div>
        <div className="history-tag">
          <Activity size={16} />
          <span>Traçabilité immuable</span>
        </div>
      </div>

      <div className="history-list">
        {transactions.map((transaction, index) => (
          <motion.article
            key={transaction.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
            className="history-item"
          >
            <div className="history-item__line">
              <span>{transaction.amount} {transaction.sourceCurrency} → {transaction.targetCurrency}</span>
              <strong style={{ color: '#00e5ff' }}>{transaction.status}</strong>
            </div>
            <div className="history-item__line">
              <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.8rem' }}>
                Dest. : {transaction.recipient}
              </span>
              <span className="history-time">
                <Clock3 size={14} /> {transaction.date}
              </span>
            </div>
            <div className="history-item__meta">Taux de conversion : {transaction.rate}</div>
          </motion.article>
        ))}
      </div>
    </Card>
  );
}
