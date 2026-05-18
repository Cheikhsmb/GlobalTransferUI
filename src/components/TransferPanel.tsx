import { ArrowRight, Sparkles, ShieldCheck, Globe2, ArrowDownUp, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

const SUPPORTED_PAIRS = new Set(['XOF-EUR', 'XOF-USD']);
const SEPOLIA_EXPLORER = 'https://sepolia.etherscan.io/tx';

export function TransferPanel() {
  const connectWallet  = useAppStore((s) => s.connectWallet);
  const executeTransfer = useAppStore((s) => s.executeTransfer);
  const account        = useAppStore((s) => s.account);
  const status         = useAppStore((s) => s.status);
  const xofBalance     = useAppStore((s) => s.xofBalance);
  const isPending      = useAppStore((s) => s.isPending);
  const lastTxHash     = useAppStore((s) => s.lastTxHash);
  const rates          = useAppStore((s) => s.rates);

  const [amount, setAmount]       = useState('10500');
  const [recipient, setRecipient] = useState('');
  const [sourceCurrency, setSourceCurrency] = useState<'XOF' | 'USD' | 'EUR'>('XOF');
  const [targetCurrency, setTargetCurrency] = useState<'XOF' | 'USD' | 'EUR'>('EUR');
  const [error, setError] = useState('');

  const pairKey = `${sourceCurrency}-${targetCurrency}`;
  const isSupported = SUPPORTED_PAIRS.has(pairKey);

  const getRate = () => {
    if (sourceCurrency === 'XOF' && targetCurrency === 'EUR') return 1 / rates.EUR;
    if (sourceCurrency === 'XOF' && targetCurrency === 'USD') return 1 / rates.USD;
    return null;
  };

  const rate = getRate();
  const estimate = rate && amount ? (Number(amount) * rate).toFixed(4) : '—';

  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!isSupported) return;
    if (!account) {
      setError('Connectez d\'abord votre portefeuille');
      return;
    }
    if (!recipient.match(/^0x[0-9a-fA-F]{40}$/)) {
      setError('Adresse destinataire invalide (format 0x...)');
      return;
    }
    try {
      await executeTransfer({ amount, recipient, targetCurrency: targetCurrency as 'EUR' | 'USD' });
      setError('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    }
  };

  return (
    <Card className="transfer-panel">
      <div className="transfer-panel__header">
        <div>
          <p className="eyebrow">Panneau de transfert</p>
          <h3>Envoi stablecoin</h3>
        </div>
        <div className="transfer-panel__badge">
          <Sparkles size={14} />
          <span>{sourceCurrency} → {targetCurrency}</span>
        </div>
      </div>

      <div className="transfer-panel__wallet">
        <div>
          <span>Portefeuille</span>
          <strong>{account || 'Non connecté'}</strong>
          {account && (
            <span style={{ fontSize: '0.75rem', color: '#00e5ff', display: 'block', marginTop: '2px' }}>
              Solde XOF : {Number(xofBalance).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} XOF
            </span>
          )}
        </div>
        <Button variant="ghost" type="button" onClick={connectWallet} disabled={isPending}>
          {account ? 'Reconnecter' : 'Connecter MetaMask'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="transfer-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'end' }}>
          <label>
            De
            <select value={sourceCurrency} onChange={(e) => setSourceCurrency(e.target.value as 'XOF' | 'USD' | 'EUR')} disabled={isPending}>
              <option value="XOF">XOF — Franc CFA</option>
              <option value="USD">USD — Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </label>

          <Button type="button" variant="ghost" onClick={handleSwap} disabled={isPending}
            style={{ padding: '0.85rem', marginBottom: '2px', borderRadius: '0.75rem' }}
            aria-label="Inverser les devises">
            <ArrowDownUp size={16} />
          </Button>

          <label>
            Vers
            <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value as 'XOF' | 'USD' | 'EUR')} disabled={isPending}>
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — Dollar</option>
              <option value="XOF">XOF — Franc CFA</option>
            </select>
          </label>
        </div>

        <label>
          Montant {sourceCurrency}
          <input
            inputMode="decimal"
            pattern="[0-9]*\.?[0-9]*"
            value={amount}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Ex : 15000"
            disabled={isPending}
          />
        </label>

        <label>
          Adresse du destinataire
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={isPending}
          />
        </label>

        <div className="transfer-panel__rates">
          {isSupported && rate ? (
            <>
              <div>
                <span>Taux (oracle)</span>
                <strong>1 {sourceCurrency} ≈ {rate.toFixed(6)} {targetCurrency}</strong>
              </div>
              <div>
                <span>Estimation</span>
                <strong>{estimate} {targetCurrency}</strong>
              </div>
            </>
          ) : (
            <div style={{ gridColumn: '1 / -1', color: '#ff6b6b', fontSize: '0.85rem' }}>
              Paire non supportée par le contrat — seules XOF → EUR et XOF → USD sont disponibles
            </div>
          )}
        </div>

        {error && (
          <div style={{ color: '#ff6b6b', fontSize: '0.85rem', padding: '0.5rem 0' }}>
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!isSupported || isPending}
          style={!isSupported ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
        >
          {isPending ? (
            <><Loader2 size={16} className="mr-2" style={{ animation: 'spin 1s linear infinite' }} /> Transaction en cours…</>
          ) : isSupported ? (
            <>Envoyer sur Sepolia <ArrowRight size={16} className="ml-2" /></>
          ) : (
            <>Paire non supportée</>
          )}
        </Button>
      </form>

      <div className="transfer-panel__footer">
        <div>
          <ShieldCheck size={16} />
          <span>Sepolia testnet — contrat vérifié</span>
        </div>
        <div>
          <Globe2 size={16} />
          <span>{status}</span>
        </div>
        {lastTxHash && (
          <div style={{ gridColumn: '1 / -1' }}>
            <a
              href={`${SEPOLIA_EXPLORER}/${lastTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#00e5ff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <ExternalLink size={12} />
              Voir le dernier tx sur Etherscan
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}
