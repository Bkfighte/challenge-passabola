'use client';

import { useEffect, useState, useRef } from 'react';
import { subscribeToGameEvent, updateGameStatus, updateCurrentRound, updateBandPoints, setRoundWinner, setGameWinner, GameEvent, GameBand } from '@/lib/game-service';
import { getBandScores, startEventForAllBands, stopEventForAllBands, controlBandEvent } from '@/lib/band-service';
import { addPointsToNext2025Band, getTopUsersByPoints, getTopUsersByVictories, LeaderboardEntry } from '@/lib/next2025-service';
import { Trophy, Zap, Crown, Star } from 'lucide-react';

export default function GameDisplayPage() {
  const [gameEvent, setGameEvent] = useState<GameEvent | null>(null);
  const [countdown, setCountdown] = useState<number>(3);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [band010Points, setBand010Points] = useState<number>(0);
  const [band020Points, setBand020Points] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState<'points' | 'victories'>('points');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  
  const statusRef = useRef<string>('');
  const roundStartTimeRef = useRef<number>(0);

  // Escutar mudanças no evento
  useEffect(() => {
    const unsubscribe = subscribeToGameEvent((event) => {
      setGameEvent(event);
      
      // Quando evento é criado, inicia automaticamente
      if (event && event.status === 'waiting' && statusRef.current !== 'waiting') {
        statusRef.current = 'waiting';
        setTimeout(() => {
          startRound1Intro();
        }, 1000);
      }
    });
    
    return unsubscribe;
  }, []);

  // Gerenciar contagem regressiva
  useEffect(() => {
    if (gameEvent?.status === 'round1_countdown' || gameEvent?.status === 'round2_countdown') {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            // Inicia o round ativo
            if (gameEvent.status === 'round1_countdown') {
              startRound1();
            } else {
              startRound2();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameEvent?.status]);

  // Gerenciar timer do round ativo
  useEffect(() => {
    if (gameEvent?.status === 'round1_active' || gameEvent?.status === 'round2_active') {
      const currentRound = gameEvent.rounds[gameEvent.currentRound];
      roundStartTimeRef.current = Date.now();
      setTimeRemaining(currentRound.duration);
      
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - roundStartTimeRef.current) / 1000);
        const remaining = currentRound.duration - elapsed;
        
        if (remaining <= 0) {
          clearInterval(interval);
          setTimeRemaining(0);
          // Finaliza o round
          if (gameEvent.status === 'round1_active') {
            finishRound1();
          } else {
            finishRound2();
          }
        } else {
          setTimeRemaining(remaining);
        }
      }, 100);
      
      // Atualizar pontos em tempo real
      const pointsInterval = setInterval(() => {
        updatePoints();
      }, 1000);
      
      return () => {
        clearInterval(interval);
        clearInterval(pointsInterval);
      };
    }
  }, [gameEvent?.status]);
  
  // Gerenciar leaderboard após finalizar
  useEffect(() => {
    if (gameEvent?.status === 'finished' && !showLeaderboard) {
      // Aguardar 8 segundos antes de mostrar o leaderboard (mais tempo para ver o resultado)
      const timer = setTimeout(() => {
        setShowLeaderboard(true);
        loadLeaderboard('points');
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [gameEvent?.status, showLeaderboard]);
  
  // Alternar entre leaderboard de pontos e vitórias
  useEffect(() => {
    if (showLeaderboard) {
      const interval = setInterval(() => {
        setLeaderboardType(prev => {
          const newType = prev === 'points' ? 'victories' : 'points';
          loadLeaderboard(newType);
          return newType;
        });
      }, 8000); // Alterna a cada 8 segundos
      
      return () => clearInterval(interval);
    }
  }, [showLeaderboard]);
  
  const loadLeaderboard = async (type: 'points' | 'victories') => {
    try {
      const data = type === 'points' 
        ? await getTopUsersByPoints(10)
        : await getTopUsersByVictories(10);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  // Funções de transição de status
  const startRound1Intro = async () => {
    await updateGameStatus('round1_intro');
    setTimeout(() => {
      startRound1Countdown();
    }, 5000); // 5 segundos mostrando o movimento
  };

  const startRound1Countdown = async () => {
    setCountdown(3);
    await updateGameStatus('round1_countdown');
  };

  const startRound1 = async () => {
    if (!gameEvent) return;
    
    await updateGameStatus('round1_active');
    setBand010Points(0);
    setBand020Points(0);
    
    // Iniciar evento nas pulseiras
    await startEventForAllBands(['010', '020']);
  };

  const finishRound1 = async () => {
    if (!gameEvent) return;
    
    // Parar pulseiras
    await stopEventForAllBands(['010', '020']);
    
    // Capturar pontos finais
    const finalPoints010 = await getFinalPoints('010');
    const finalPoints020 = await getFinalPoints('020');
    
    setBand010Points(finalPoints010);
    setBand020Points(finalPoints020);
    
    // Determinar vencedor do round
    const winner = finalPoints010 > finalPoints020 ? 'band010' : 
                   finalPoints020 > finalPoints010 ? 'band020' : 'tie';
    await setRoundWinner(0, winner);
    
    // Aguardar 3 segundos antes de iniciar round 2
    setTimeout(() => {
      startRound2Intro();
    }, 3000);
  };

  const startRound2Intro = async () => {
    await updateCurrentRound(1);
    await updateGameStatus('round2_intro');
    setTimeout(() => {
      startRound2Countdown();
    }, 5000);
  };

  const startRound2Countdown = async () => {
    setCountdown(3);
    await updateGameStatus('round2_countdown');
  };

  const startRound2 = async () => {
    if (!gameEvent) return;
    
    await updateGameStatus('round2_active');
    
    // Iniciar evento nas pulseiras
    await startEventForAllBands(['010', '020']);
  };

  const finishRound2 = async () => {
    if (!gameEvent) return;
    
    console.log('=== Finalizando Round 2 ===');
    
    // Parar pulseiras
    await stopEventForAllBands(['010', '020']);
    
    // Aguardar um pouco para garantir que os dados foram coletados
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Capturar pontos finais do round 2
    const finalPoints010 = await getFinalPoints('010');
    const finalPoints020 = await getFinalPoints('020');
    
    console.log('Round 2 - Band 010:', finalPoints010);
    console.log('Round 2 - Band 020:', finalPoints020);
    
    // Somar com pontos do round 1
    const totalPoints010 = band010Points + finalPoints010;
    const totalPoints020 = band020Points + finalPoints020;
    
    console.log('Total - Band 010:', totalPoints010);
    console.log('Total - Band 020:', totalPoints020);
    
    setBand010Points(totalPoints010);
    setBand020Points(totalPoints020);
    
    // Determinar vencedor do round 2
    const roundWinner = finalPoints010 > finalPoints020 ? 'band010' : 
                        finalPoints020 > finalPoints010 ? 'band020' : 'tie';
    await setRoundWinner(1, roundWinner);
    
    // Determinar vencedor geral
    const winner = totalPoints010 > totalPoints020 ? 'band010' : 
                   totalPoints020 > totalPoints010 ? 'band020' : 'tie';
    
    console.log('Vencedor geral:', winner);
    
    await setGameWinner(winner);
    
    // Adicionar pontos aos usuários NEXT 2025
    if (gameEvent.bands.band010) {
      await addPointsToNext2025Band('010', totalPoints010, 'Pontos ganhos no Jogo de Movimento');
    }
    if (gameEvent.bands.band020) {
      await addPointsToNext2025Band('020', totalPoints020, 'Pontos ganhos no Jogo de Movimento');
    }
    
    console.log('=== Round 2 Finalizado ===');
  };

  const updatePoints = async () => {
    if (!gameEvent || (gameEvent.status !== 'round1_active' && gameEvent.status !== 'round2_active')) return;
    
    try {
      const scores010 = await getBandScores('010');
      const scores020 = await getBandScores('020');
      
      const currentRound = gameEvent.rounds[gameEvent.currentRound];
      const axis = currentRound.axis;
      
      const points010 = Math.abs(scores010[`score${axis}`]?.value || 0);
      const points020 = Math.abs(scores020[`score${axis}`]?.value || 0);
      
      if (gameEvent.status === 'round1_active') {
        setBand010Points(Math.round(points010));
        setBand020Points(Math.round(points020));
      } else {
        // Round 2: adiciona aos pontos do round 1
        setBand010Points(prev => Math.round(points010));
        setBand020Points(prev => Math.round(points020));
      }
    } catch (error) {
      console.error('Error updating points:', error);
    }
  };

  const getFinalPoints = async (bandId: string): Promise<number> => {
    try {
      const scores = await getBandScores(bandId);
      const axis = gameEvent?.rounds[gameEvent.currentRound].axis || 'Y';
      return Math.round(Math.abs(scores[`score${axis}`]?.value || 0));
    } catch (error) {
      console.error('Error getting final points:', error);
      return 0;
    }
  };

  if (!gameEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-pulse mb-4">
            <Zap className="h-16 w-16 mx-auto" />
          </div>
          <p className="text-2xl font-bold">Aguardando novo jogo...</p>
        </div>
      </div>
    );
  }

  const currentRound = gameEvent.rounds[gameEvent.currentRound];
  const band010 = gameEvent.bands.band010;
  const band020 = gameEvent.bands.band020;

  // TELA 1: Intro do Round
  if (gameEvent.status === 'round1_intro' || gameEvent.status === 'round2_intro') {
    const roundNumber = gameEvent.status === 'round1_intro' ? 1 : 2;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-8">
        <div className="text-center text-white space-y-8 animate-fade-in">
          <h1 className="text-8xl font-black tracking-tight drop-shadow-2xl">
            {roundNumber === 1 ? 'PRIMEIRO JOGO!' : 'SEGUNDO JOGO!'}
          </h1>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 border-4 border-white/30 shadow-2xl">
            <p className="text-3xl font-bold mb-4">Movimento:</p>
            <p className="text-7xl font-black uppercase tracking-wider">
              {currentRound.movement}
            </p>
          </div>
          
          <p className="text-2xl font-semibold opacity-80">
            Prepare-se! O jogo começará em breve...
          </p>
        </div>
      </div>
    );
  }

  // TELA 2: Contagem Regressiva
  if (gameEvent.status === 'round1_countdown' || gameEvent.status === 'round2_countdown') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex flex-col items-center justify-center p-8">
        <div className="text-center text-white space-y-12">
          <div className="relative">
            <div className="text-[20rem] font-black leading-none animate-bounce-slow drop-shadow-2xl">
              {countdown}
            </div>
          </div>
          
          {/* Espaço para animação do boneco */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 border-4 border-white/20 w-96 h-96 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">🏃‍♂️</div>
              <p className="text-xl font-semibold">
                [Animação: {currentRound.movement}]
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TELA 3: Jogo Ativo
  if (gameEvent.status === 'round1_active' || gameEvent.status === 'round2_active') {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Timer no topo */}
        <div className="bg-gray-800 border-b-4 border-yellow-400 py-6 px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400 mb-2">TEMPO RESTANTE</p>
              <div className="text-7xl font-black text-white tabular-nums">
                {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Área dividida - Azul vs Vermelho */}
        <div className="flex-1 flex">
          {/* Lado AZUL - Band 010 */}
          <div className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center p-12 border-r-4 border-gray-800">
            <div className="text-center space-y-8 text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 border-2 border-white/30">
                <p className="text-2xl font-bold">PULSEIRA 010</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20">
                <p className="text-3xl font-semibold mb-2">{band010?.userName}</p>
                <p className="text-xl opacity-80">{band010?.userEmail}</p>
              </div>
              
              <div className="relative">
                <div className="text-9xl font-black tabular-nums drop-shadow-2xl animate-pulse-slow">
                  {band010Points}
                </div>
                <p className="text-3xl font-bold mt-4">PONTOS</p>
              </div>
              
              {/* Indicador de pontos subindo */}
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-8 w-8 animate-bounce" />
                <div className="h-3 w-48 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${Math.min((band010Points / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Lado VERMELHO - Band 020 */}
          <div className="flex-1 bg-gradient-to-br from-red-600 to-red-800 flex flex-col items-center justify-center p-12">
            <div className="text-center space-y-8 text-white">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 border-2 border-white/30">
                <p className="text-2xl font-bold">PULSEIRA 020</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border-4 border-white/20">
                <p className="text-3xl font-semibold mb-2">{band020?.userName}</p>
                <p className="text-xl opacity-80">{band020?.userEmail}</p>
              </div>
              
              <div className="relative">
                <div className="text-9xl font-black tabular-nums drop-shadow-2xl animate-pulse-slow">
                  {band020Points}
                </div>
                <p className="text-3xl font-bold mt-4">PONTOS</p>
              </div>
              
              {/* Indicador de pontos subindo */}
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-8 w-8 animate-bounce" />
                <div className="h-3 w-48 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${Math.min((band020Points / 1000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TELA 4: Resultado Final (5 segundos) ou Leaderboard
  if (gameEvent.status === 'finished') {
    const totalPoints010 = band010Points;
    const totalPoints020 = band020Points;
    const isDraw = totalPoints010 === totalPoints020;
    const winner = gameEvent.winner;
    
    // Após 5 segundos, mostra o leaderboard
    if (showLeaderboard) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header do Leaderboard */}
            <div className="text-center mb-12 animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                {leaderboardType === 'points' ? (
                  <Crown className="h-16 w-16 text-yellow-400" />
                ) : (
                  <Trophy className="h-16 w-16 text-yellow-400" />
                )}
              </div>
              <h1 className="text-7xl font-black text-white mb-4 drop-shadow-2xl">
                {leaderboardType === 'points' ? 'TOP PONTUADORES' : 'TOP VENCEDORES'}
              </h1>
              <p className="text-2xl text-white/80">
                {leaderboardType === 'points' ? 'Ranking por Pontos' : 'Ranking por Vitórias'}
              </p>
            </div>

            {/* Lista do Leaderboard */}
            <div className="space-y-4">
              {leaderboardData.map((entry, index) => (
                <div
                  key={entry.userId}
                  className={`flex items-center gap-6 p-6 rounded-2xl backdrop-blur-sm border-2 transition-all animate-fade-in ${
                    index === 0
                      ? 'bg-yellow-500/30 border-yellow-400 scale-105'
                      : index === 1
                      ? 'bg-gray-300/20 border-gray-300'
                      : index === 2
                      ? 'bg-orange-600/20 border-orange-400'
                      : 'bg-white/10 border-white/20'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Posição */}
                  <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                    {index === 0 ? (
                      <div className="text-5xl">🥇</div>
                    ) : index === 1 ? (
                      <div className="text-5xl">🥈</div>
                    ) : index === 2 ? (
                      <div className="text-5xl">🥉</div>
                    ) : (
                      <div className="text-4xl font-black text-white/70">#{entry.rank}</div>
                    )}
                  </div>

                  {/* Nome */}
                  <div className="flex-1">
                    <p className="text-3xl font-bold text-white">{entry.userName}</p>
                  </div>

                  {/* Estatísticas */}
                  <div className="flex gap-8 items-center">
                    {leaderboardType === 'points' ? (
                      <>
                        <div className="text-right">
                          <p className="text-5xl font-black text-white tabular-nums">
                            {entry.points}
                          </p>
                          <p className="text-sm text-white/60 uppercase">Pontos</p>
                        </div>
                        <div className="text-right opacity-60">
                          <p className="text-2xl font-bold text-white">
                            {entry.victories}
                          </p>
                          <p className="text-xs text-white/60 uppercase">Vitórias</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-right">
                          <p className="text-5xl font-black text-white tabular-nums">
                            {entry.victories}
                          </p>
                          <p className="text-sm text-white/60 uppercase">Vitórias</p>
                        </div>
                        <div className="text-right opacity-60">
                          <p className="text-2xl font-bold text-white">
                            {entry.points}
                          </p>
                          <p className="text-xs text-white/60 uppercase">Pontos</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    
    // Primeiros 8 segundos: Tela de resultado
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center p-8">
        <div className="text-center text-white space-y-12 animate-fade-in">
          {isDraw ? (
            <>
              <h1 className="text-9xl font-black tracking-tight drop-shadow-2xl animate-pulse">
                EMPATE!
              </h1>
              <p className="text-5xl font-bold opacity-90">
                Ambos jogadores foram incríveis! 🎮
              </p>
            </>
          ) : (
            <>
              <div className="relative">
                <Trophy className="h-40 w-40 mx-auto animate-bounce text-yellow-400 drop-shadow-2xl" />
                <div className="absolute inset-0 animate-ping">
                  <Star className="h-40 w-40 mx-auto text-yellow-400 opacity-30" />
                </div>
              </div>
              <h1 className="text-9xl font-black tracking-tight drop-shadow-2xl">
                FIM DE JOGO!
              </h1>
            </>
          )}

          <div className="grid grid-cols-2 gap-12 mt-12 max-w-5xl mx-auto">
            {/* Band 010 */}
            <div className={`bg-blue-600/30 backdrop-blur-sm rounded-3xl p-10 border-4 ${
              winner === 'band010' 
                ? 'border-yellow-400 scale-110 shadow-2xl shadow-yellow-400/50' 
                : 'border-white/20 opacity-70'
            } transition-all duration-500`}>
              <div className="text-3xl font-bold mb-6">PULSEIRA 010</div>
              <div className="text-8xl font-black mb-4 tabular-nums">{totalPoints010}</div>
              <div className="text-2xl font-semibold mb-2">{band010?.userName}</div>
              <div className="text-lg opacity-80">{band010?.userEmail}</div>
              {winner === 'band010' && (
                <div className="mt-6 text-5xl font-black text-yellow-400 animate-pulse">
                  🏆 VENCEDOR! 🏆
                </div>
              )}
            </div>

            {/* Band 020 */}
            <div className={`bg-red-600/30 backdrop-blur-sm rounded-3xl p-10 border-4 ${
              winner === 'band020' 
                ? 'border-yellow-400 scale-110 shadow-2xl shadow-yellow-400/50' 
                : 'border-white/20 opacity-70'
            } transition-all duration-500`}>
              <div className="text-3xl font-bold mb-6">PULSEIRA 020</div>
              <div className="text-8xl font-black mb-4 tabular-nums">{totalPoints020}</div>
              <div className="text-2xl font-semibold mb-2">{band020?.userName}</div>
              <div className="text-lg opacity-80">{band020?.userEmail}</div>
              {winner === 'band020' && (
                <div className="mt-6 text-5xl font-black text-yellow-400 animate-pulse">
                  🏆 VENCEDOR! 🏆
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 space-y-4">
            <p className="text-4xl font-bold">
              Parabéns aos participantes! 🎉
            </p>
            <p className="text-2xl opacity-70">
              Aguarde o ranking geral...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
