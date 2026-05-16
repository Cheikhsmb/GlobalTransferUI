import { ArrowRight, Sparkles, ShieldCheck, Globe2, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function TransferPanel() {
  const connectWallet = useAppStore((s) => s.connectWallet);
  const account = useAppStore((s) => s.account);
  const addTransaction = useAppStore((s) => s.addTransaction);
  const status = useAppStore((s) => s.status);
  const [amount, setAmount] = useState('10500');
  const [recipient, setRecipient] = useState('0xA1f3...B72d');
  
  const [sourceCurrency, setSourceCurrency] = useState<'XOF' | 'USD' | 'EUR'>('XOF');
  const [targetCurrency, setTargetCurrency] = useState<'XOF' | 'USD' | 'EUR'>('EUR');

  const getRate = () => {
    if (sourceCurrency === 'XOF' && targetCurrency === 'EUR') return 0.0015;
    if (sourceCurrency === 'XOF' && targetCurrency === 'USD') return 0.0017;
    if (sourceCurrency === 'USD' && targetCurrency === 'XOF') return 588.23;
    if (sourceCurrency === 'EUR' && targetCurrency === 'XOF') return 655.95;
    if (sourceCurrency === 'EUR' && targetCurrency === 'USD') return 1.08;
    if (sourceCurrency === 'USD' && targetCurrency === 'EUR') return 0.92;
    return 1;
  };

  const rate = getRate();
  const estimate = amount ? (Number(amount) * rate).toFixed(targetCurrency === 'XOF' ? 0 : 4) : '0.00';

  const handleSwap = () => {
    setSourceCurrency(targetCurrency);
    setTargetCurrency(sourceCurrency);
    if (targetCurrency === 'XOF') {
      setAmount((Number(amount) * rate).toFixed(0));
    } else {
      setAmount((Number(amount) * rate).toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTransaction({ amount, recipient, sourceCurrency, targetCurrency, rate });
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
        </div>
        <Button variant="ghost" type="button" onClick={connectWallet}>
          {account ? 'Reconnecter' : 'Connecter MetaMask'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="transfer-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'end' }}>
            <label>
            De
            <select value={sourceCurrency} onChange={(e) => setSourceCurrency(e.target.value as any)}>
                <option value="XOF">XOF — Franc CFA</option>
                <option value="USD">USD — Dollar</option>
                <option value="EUR">EUR — Euro</option>
            </select>
            </label>
            
            <Button type="button" variant="ghost" onClick={handleSwap} style={{ padding: '0.85rem', marginBottom: '2px', borderRadius: '0.75rem' }} aria-label="Inverser les devises">
               <ArrowDownUp size={16} />
            </Button>

            <label>
            Vers
            <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value as any)}>
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
          />
        </label>

        <label>
          Adresse du destinataire
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
          />
        </label>

        <div className="transfer-panel__rates">
          <div>
            <span>Taux</span>
            <strong>1 {sourceCurrency} = {rate} {targetCurrency}</strong>
          </div>
          <div>
            <span>Estimation</span>
            <strong>{estimate} {targetCurrency}</strong>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Envoyer en simulation
          <ArrowRight size={16} className="ml-2" />
        </Button>
      </form>

      <div className="transfer-panel__footer">
        <div>
          <ShieldCheck size={16} />
          <span>Sans gaz réel — mode simulation</span>
        </div>
        <div>
          <Globe2 size={16} />
          <span>{status}</span>
        </div>
      </div>
    </Card>
  );
}
