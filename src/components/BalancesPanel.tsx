import { motion } from 'framer-motion';
import { Wallet, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';

type TokenRowProps = {
  symbol: string;
  label: string;
  balance: string;
  color: string;
  index: number;
};

function TokenRow({ symbol, label, balance, color, index }: TokenRowProps) {
  const formatted = Number(balance).toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.9rem 1rem',
        borderRadius: '0.75rem',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        marginBottom: '0.5rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: `${color}22`, border: `1.5px solid ${color}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.75rem', color,
          fontFamily: '"JetBrains Mono", monospace',
        }}>
          {symbol}
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{symbol}</div>
          <div style={{ fontSize: '0.73rem', color: '#888' }}>{label}</div>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 700, fontFamily: '"JetBrains Mono", monospace', color }}>
          {formatted}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#666' }}>{symbol}</div>
      </div>
    </motion.div>
  );
}

export function BalancesPanel() {
  const account    = useAppStore((s) => s.account);
  const xofBalance = useAppStore((s) => s.xofBalance);
  const eurBalance = useAppStore((s) => s.eurBalance);
  const usdBalance = useAppStore((s) => s.usdBalance);
  const refreshBalance = useAppStore((s) => s.refreshBalance);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshBalance();
    setRefreshing(false);
  };

  return (
    <Card style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <p className="eyebrow" style={{ marginBottom: '0.2rem' }}>
            <Wallet size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Portefeuille on-chain
          </p>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Mes soldes de tokens</h3>
        </div>
        <Button
          variant="ghost"
          onClick={handleRefresh}
          disabled={!account || refreshing}
          style={{ padding: '0.5rem', borderRadius: '0.6rem' }}
          aria-label="Actualiser les soldes"
        >
          <RefreshCw size={15} style={refreshing ? { animation: 'spin 1s linear infinite' } : undefined} />
        </Button>
      </div>

      {!account ? (
        <p style={{ color: '#666', fontSize: '0.88rem' }}>
          Connectez votre portefeuille MetaMask pour voir vos soldes.
        </p>
      ) : (
        <div>
          <TokenRow index={0} symbol="XOF" label="Franc CFA — à envoyer"   balance={xofBalance} color="#00e5ff" />
          <TokenRow index={1} symbol="EUR" label="Euro — reçu via transfert" balance={eurBalance} color="#a78bfa" />
          <TokenRow index={2} symbol="USD" label="Dollar — reçu via transfert" balance={usdBalance} color="#34d399" />
        </div>
      )}
    </Card>
  );
}
