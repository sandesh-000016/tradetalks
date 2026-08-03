"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  LogOut,
  RefreshCw,
  Edit,
  Trash2,
  Globe,
  DollarSign,
  TrendingUp,
  X,
  Check,
  AlertTriangle,
  UserCheck,
  Search,
  Lock,
  ChevronRight,
  Database,
  Award,
  Calendar,
  Play,
  Clock,
  Plus,
  ClipboardList,
  Download,
  Phone,
  Mail,
  MapPin,
  Trophy
} from "lucide-react";
import { renderBadgeIcon } from "@/components/BadgeIcons";

interface Trader {
  _id: string;
  clientId: string;
  numericId?: number;
  clientName: string;
  totalNetDeposits: number;
  lastRecordedBalance?: number;
  isWashedOut: boolean;
  isRegistered: boolean;
  lastUpdated?: string;
  // Merged fields
  profit?: number;
  volume?: number;
  country?: string;
  registrationDate?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "traders" | "badges" | "liveSearch" | "registrations" | "promoted" | "pointsHistory">("overview");

  // State for traders data
  const [pointsHistory, setPointsHistory] = useState<any[]>([]);
  const [loadingPointsHistory, setLoadingPointsHistory] = useState(false);
  const [refreshingPointsHistory, setRefreshingPointsHistory] = useState(false);
  const [pointsSearchQuery, setPointsSearchQuery] = useState("");
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Badge configuration & evaluation states
  const [badgeRules, setBadgeRules] = useState<any[]>([]);
  const [awardedBadges, setAwardedBadges] = useState<any[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(false);
  const [editingRule, setEditingRule] = useState<any | null>(null);
  const [savingRule, setSavingRule] = useState(false);

  // Evaluation states
  const [evaluatingBadge, setEvaluatingBadge] = useState<string | null>(null);
  const [proposedWinners, setProposedWinners] = useState<any[]>([]);
  const [proposedRule, setProposedRule] = useState<any | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalPeriod, setEvalPeriod] = useState("");
  const [awardingTraderId, setAwardingTraderId] = useState<string | null>(null);

  // Global settings state
  const [globalSettings, setGlobalSettings] = useState({
    minVolumePer100NetDeposits: 0.6,
    minEquityForWashout: 1.0,
  });
  const [savingGlobalSettings, setSavingGlobalSettings] = useState(false);

  // Winner promotions state
  const [winnerPromotions, setWinnerPromotions] = useState<any[]>([]);
  const [loadingWinners, setLoadingWinners] = useState(false);
  const [editingWinner, setEditingWinner] = useState<any | null>(null);
  const [savingWinner, setSavingWinner] = useState(false);
  const [isAwardingAll, setIsAwardingAll] = useState(false);

  // Manual Award states
  const [manualAward, setManualAward] = useState({
    traderId: "",
    badgeName: "",
    period: "Season 1",
    points: 50,
  });
  const [isAwardingManual, setIsAwardingManual] = useState(false);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Edit deposit state
  const [editingTrader, setEditingTrader] = useState<Trader | null>(null);
  const [newDepositAmount, setNewDepositAmount] = useState("");
  const [depositUpdateMode, setDepositUpdateMode] = useState<"baseline" | "cash_flow">("baseline");
  const [cashFlowAmount, setCashFlowAmount] = useState("");
  const [updatingDeposit, setUpdatingDeposit] = useState(false);

  // Live API Search states
  const [liveSearchQuery, setLiveSearchQuery] = useState("");
  const [liveSearchResults, setLiveSearchResults] = useState<any[]>([]);
  const [searchingLive, setSearchingLive] = useState(false);

  // Registrations states
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [regSearchQuery, setRegSearchQuery] = useState("");

  // Cron History state
  const [cronHistory, setCronHistory] = useState<any[]>([]);
  const [loadingCronHistory, setLoadingCronHistory] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const fetchBadgesData = async () => {
    setLoadingBadges(true);
    try {
      const resRules = await fetch("/api/admin/badge-rules");
      const dataRules = await resRules.json();
      if (resRules.ok && dataRules.success) {
        setBadgeRules(dataRules.rules);
      }

      const resAwarded = await fetch("/api/admin/awarded-badges");
      const dataAwarded = await resAwarded.json();
      if (resAwarded.ok && dataAwarded.success) {
        setAwardedBadges(dataAwarded.awardedBadges);
      }
    } catch (err) {
      console.error("Error loading badge data:", err);
    } finally {
      setLoadingBadges(false);
    }
  };

  const fetchRegistrations = async () => {
    setLoadingRegistrations(true);
    try {
      const res = await fetch("/api/registrations");
      const data = await res.json();
      if (data.success) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error("Error loading registrations:", err);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const exportToExcel = () => {
    const headers = [
      "Full Name", "Phone", "Email", "City", "State",
      "Experience", "How Heard", "Trading Goal", "Client ID", "Submitted At"
    ];
    const rows = registrations.map((r) => [
      r.fullName || r.clientName || "",
      r.phone || "",
      r.email || "",
      r.city || "",
      r.state || "",
      r.experience || "",
      r.howHeard || "",
      r.tradingGoal || "",
      r.clientId || "",
      r.submittedAt ? new Date(r.submittedAt).toLocaleString() : ""
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tradetalks_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };


  const fetchCronHistory = async () => {
    setLoadingCronHistory(true);
    try {
      const res = await fetch("/api/admin/cron-history");
      const data = await res.json();
      if (res.ok && data.success) {
        setCronHistory(data.logs);
      }
    } catch (err) {
      console.error("Error fetching cron history:", err);
    } finally {
      setLoadingCronHistory(false);
    }
  };

  const fetchPointsHistory = async (forceRefresh = false) => {
    if (forceRefresh) {
      setRefreshingPointsHistory(true);
    } else {
      setLoadingPointsHistory(true);
    }
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/points-history?refresh=${forceRefresh}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load points history.");
      setPointsHistory(data.traders || []);
      if (forceRefresh) {
        setSuccessMsg("Points history refreshed successfully from live API!");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch points history.");
    } finally {
      setLoadingPointsHistory(false);
      setRefreshingPointsHistory(false);
    }
  };

  useEffect(() => {
    if (activeTab === "overview" && isAuthenticated) {
      fetchCronHistory();
    }
    if (activeTab === "pointsHistory" && isAuthenticated) {
      fetchPointsHistory();
    }
  }, [activeTab, isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/login");
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
        fetchData();
        fetchBadgesData();
        fetchGlobalSettings();
        fetchWinnerPromotions();
        fetchCronHistory();
        fetchPointsHistory();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchData();
        fetchBadgesData();
        fetchGlobalSettings();
        fetchWinnerPromotions();
        fetchCronHistory();
        fetchPointsHistory();
      } else {
        setLoginError(data.error || "Invalid password");
      }
    } catch (err) {
      setLoginError("Something went wrong. Please try again.");
    }
  };

  const handleLogout = async () => {
    // Clear session cookie by sending empty or wrong value, or we can refresh
    // For simplicity, we trigger browser reload after setting a dummy login check
    await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong_password" }),
    });
    window.location.reload();
  };

  const fetchData = async (silent = false) => {
    if (!silent) setLoading(true);
    setErrorMsg("");
    try {
      // Fetch DB list of registered traders (Extremely fast MongoDB query)
      const resDb = await fetch("/api/admin/traders");
      if (!resDb.ok) throw new Error("Failed to load registered users database.");
      const dataDb = await resDb.json();

      // Render the traders list from the database immediately
      const dbTraders = dataDb.traders.map((rt: any) => ({
        ...rt,
        clientId: rt.clientId || rt._id,
        profit: rt.profit ?? 0,
        volume: rt.volume ?? 0,
        country: rt.country ?? "India",
        registrationDate: rt.registrationDate ?? "N/A",
        lastRecordedBalance: rt.lastRecordedBalance ?? 0
      }));
      setTraders(dbTraders);
      if (!silent) setLoading(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to fetch data.");
      if (!silent) setLoading(false);
    }
  };

  // Sync data with Alpari API
  const handleSync = async () => {
    setSyncing(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Manual synchronization failed.");
      setSuccessMsg(`Synced ${data.count} traders successfully!`);
      await fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || "Sync failed.");
    } finally {
      setSyncing(false);
    }
  };


  // Update Deposit
  const handleUpdateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrader) return;
    setUpdatingDeposit(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const payload: any = { clientId: editingTrader.clientId };
      if (depositUpdateMode === "cash_flow") {
        if (isNaN(Number(cashFlowAmount)) || Number(cashFlowAmount) === 0) {
          throw new Error("Please enter a valid non-zero cash flow amount.");
        }
        payload.updateType = "twr_cash_flow";
        payload.cashFlowAmount = Number(cashFlowAmount);
      } else {
        if (isNaN(Number(newDepositAmount))) {
          throw new Error("Please enter a valid deposit amount.");
        }
        payload.updateType = "baseline";
        payload.totalNetDeposits = Number(newDepositAmount);
      }

      const res = await fetch("/api/admin/traders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update deposit.");
      
      if (depositUpdateMode === "cash_flow") {
        setSuccessMsg(`TWR Cash Flow of $${cashFlowAmount} registered for ${editingTrader.clientName}! ROI percentage remains intact.`);
      } else {
        setSuccessMsg(`Updated baseline net deposit for ${editingTrader.clientName} to $${newDepositAmount}!`);
      }
      setEditingTrader(null);
      setNewDepositAmount("");
      setCashFlowAmount("");
      await fetchData(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update deposit.");
    } finally {
      setUpdatingDeposit(false);
    }
  };

  // Reset Simulation back to original live state
  const handleResetSimulation = async () => {
    if (!editingTrader) return;
    setUpdatingDeposit(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/traders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: editingTrader.clientId, updateType: "reset_simulation" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset simulation.");
      setSuccessMsg(`Reset simulation for ${editingTrader.clientName} back to live Alpari baseline!`);
      setEditingTrader(null);
      await fetchData(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset simulation.");
    } finally {
      setUpdatingDeposit(false);
    }
  };

  // Toggle Washout / Disqualification
  const handleToggleDisqualification = async (trader: Trader) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      // Optimistic UI update for instant toggling
      setTraders(prev =>
        prev.map(t => t.clientId === trader.clientId ? { ...t, isWashedOut: !t.isWashedOut } : t)
      );

      const res = await fetch("/api/admin/traders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: trader.clientId,
          isWashedOut: !trader.isWashedOut
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status.");
      setSuccessMsg(`Disqualification status updated for ${trader.clientName}.`);
      await fetchData(true);
    } catch (err: any) {
      // Rollback optimistic update on failure
      setTraders(prev =>
        prev.map(t => t.clientId === trader.clientId ? { ...t, isWashedOut: trader.isWashedOut } : t)
      );
      setErrorMsg(err.message || "Failed to change status.");
    }
  };

  // Unregister / Remove Trader
  const handleUnregister = async (clientId: string, name: string) => {
    if (!confirm(`Are you sure you want to unregister ${name}? They will be removed from the leaderboard.`)) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/traders?clientId=${clientId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to unregister trader.");
      setSuccessMsg(`Trader ${name} removed from active leaderboard list.`);
      await fetchData(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete.");
    }
  };

  const handleLiveSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!liveSearchQuery.trim()) return;
    
    setSearchingLive(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/traders/live-search?q=${encodeURIComponent(liveSearchQuery)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to query live metrics.");
      setLiveSearchResults(data.traders || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to search live traders.");
    } finally {
      setSearchingLive(false);
    }
  };

  // Save badge rule
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRule) return;
    setSavingRule(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const parsedConditions = (editingRule.conditions || []).map((cond: any) => ({
        ...cond,
        value: Number(cond.value ?? 0),
      }));
      const firstCond = parsedConditions[0] || { metric: "profit", operator: "gte", value: 0 };
      const payload = {
        ...editingRule,
        conditions: parsedConditions,
        metric: firstCond.metric,
        operator: firstCond.operator,
        value: firstCond.value,
      };

      const res = await fetch("/api/admin/badge-rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update rule.");
      setSuccessMsg(`Rule for "${editingRule._id}" updated successfully!`);
      setEditingRule(null);
      await fetchBadgesData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save rule.");
    } finally {
      setSavingRule(false);
    }
  };

  // Evaluate badge proposed winners
  const handleEvaluateBadge = async (badgeName: string) => {
    setIsEvaluating(true);
    setEvaluatingBadge(badgeName);
    setProposedWinners([]);
    setErrorMsg("");
    setSuccessMsg("");

    // Set default period based on badge type
    if (badgeName === "Top Rank Monthly") {
      const date = new Date();
      setEvalPeriod(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`);
    } else if (badgeName === "Trader of the Week") {
      const date = new Date();
      // Simple ISO week calculation
      const oneJan = new Date(date.getFullYear(), 0, 1);
      const numberOfDays = Math.floor((date.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
      setEvalPeriod(`${date.getFullYear()}-W${week}`);
    } else {
      setEvalPeriod("Season 1");
    }

    try {
      const res = await fetch("/api/admin/evaluate-badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeName }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to evaluate.");
      setProposedWinners(data.proposedWinners || []);
      setProposedRule(data.rule);
      if (data.proposedWinners.length === 0) {
        setSuccessMsg(`Evaluation complete: No traders met the criteria for "${badgeName}" currently.`);
      } else {
        setSuccessMsg(`Evaluation complete: Found ${data.proposedWinners.length} proposed winners for "${badgeName}".`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Evaluation failed.");
      setEvaluatingBadge(null);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Award badge to proposed winner
  const handleAwardBadge = async (winner: any) => {
    if (!evaluatingBadge || !evalPeriod) return;
    setAwardingTraderId(winner.id);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/award-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traderId: String(winner.id),
          traderName: winner.name,
          badgeName: evaluatingBadge,
          points: proposedRule?.points || 0,
          period: evalPeriod,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to award badge.");
      setSuccessMsg(data.message || `Awarded ${evaluatingBadge} to ${winner.name}!`);
      await fetchBadgesData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to award badge.");
    } finally {
      setAwardingTraderId(null);
    }
  };

  // Revoke badge from trader
  const handleRevokeBadge = async (badge: any) => {
    if (!confirm(`Are you sure you want to revoke the "${badge.badgeName}" badge from ${badge.traderName}?`)) {
      return;
    }
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/admin/award-badge?traderId=${badge.traderId}&badgeName=${encodeURIComponent(badge.badgeName)}&period=${encodeURIComponent(badge.period)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to revoke badge.");
      setSuccessMsg(data.message || `Revoked ${badge.badgeName} from ${badge.traderName}.`);
      await fetchBadgesData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to revoke badge.");
    }
  };

  // Submit manual award
  const handleManualAwardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualAward.traderId || !manualAward.badgeName) return;
    
    // Find trader name
    const trader = traders.find(t => t.clientId === manualAward.traderId);
    if (!trader) return;

    setIsAwardingManual(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/award-badge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          traderId: manualAward.traderId,
          traderName: trader.clientName,
          badgeName: manualAward.badgeName,
          points: manualAward.points,
          period: manualAward.period,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to award badge.");
      setSuccessMsg(data.message || `Successfully awarded ${manualAward.badgeName} to ${trader.clientName}!`);
      // Reset form
      setManualAward({
        traderId: "",
        badgeName: "",
        period: "Season 1",
        points: 50,
      });
      await fetchBadgesData();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to award badge.");
    } finally {
      setIsAwardingManual(false);
    }
  };

  const fetchGlobalSettings = async () => {
    try {
      const res = await fetch("/api/admin/global-settings");
      const data = await res.json();
      if (res.ok && data.success && data.settings) {
        setGlobalSettings({
          minVolumePer100NetDeposits: Number(data.settings.minVolumePer100NetDeposits ?? 0.6),
          minEquityForWashout: Number(data.settings.minEquityForWashout ?? 1.0),
        });
      }
    } catch (err) {
      console.error("Failed to load global settings in admin:", err);
    }
  };

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGlobalSettings(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/admin/global-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(globalSettings),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update global settings.");
      setSuccessMsg("Global eligibility rules updated successfully! Leaderboard caches invalidated.");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save global settings.");
    } finally {
      setSavingGlobalSettings(false);
    }
  };

  const fetchWinnerPromotions = async () => {
    setLoadingWinners(true);
    try {
      const res = await fetch("/api/promoted-winners");
      const data = await res.json();
      if (res.ok && data.success) {
        setWinnerPromotions(data.winners || []);
      }
    } catch (err) {
      console.error("Failed to load winner promotions:", err);
    } finally {
      setLoadingWinners(false);
    }
  };

  const handleSaveWinner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWinner) return;
    setSavingWinner(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const isEdit = !!editingWinner._id;
      const url = "/api/promoted-winners";
      const method = isEdit ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingWinner),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save winner promotion.");
      setSuccessMsg(isEdit ? "Winner promotion updated successfully!" : "Winner promotion created successfully!");
      setEditingWinner(null);
      await fetchWinnerPromotions();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save winner.");
    } finally {
      setSavingWinner(false);
    }
  };

  const handleToggleWinnerEnabled = async (id: string, currentlyEnabled: boolean) => {
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch("/api/promoted-winners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: id,
          enabled: !currentlyEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to toggle winner visibility.");
      setSuccessMsg("Winner visibility updated!");
      await fetchWinnerPromotions();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to toggle status.");
    }
  };

  const handleDeleteWinner = async (id: string) => {
    if (!confirm("Are you sure you want to delete this winner promotion?")) return;
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/promoted-winners?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete winner promotion.");
      setSuccessMsg("Winner promotion deleted successfully.");
      await fetchWinnerPromotions();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete winner.");
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (JPG/JPEG only)
    const isJpg = file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg");
    if (!isJpg) {
      setErrorMsg("Only JPG/JPEG images are allowed.");
      e.target.value = ""; // Clear file input
      return;
    }

    // Validate size (< 100KB)
    if (file.size >= 100 * 1024) {
      setErrorMsg("Image size must be less than 100KB.");
      e.target.value = ""; // Clear file input
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (editingWinner) {
        setEditingWinner({ ...editingWinner, photo: reader.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAwardAllProposed = async () => {
    if (!evaluatingBadge || !evalPeriod || proposedWinners.length === 0) return;
    
    const pendingWinners = proposedWinners.filter((w) => {
      return !awardedBadges.some(
        (ab) => ab.traderId === String(w.id) && ab.badgeName === evaluatingBadge && ab.period === evalPeriod && ab.approved
      );
    });

    if (pendingWinners.length === 0) {
      setSuccessMsg("All proposed winners are already approved & awarded.");
      return;
    }

    if (!confirm(`Are you sure you want to approve & award badges to all ${pendingWinners.length} pending candidates?`)) {
      return;
    }

    setIsAwardingAll(true);
    setErrorMsg("");
    setSuccessMsg("");
    
    let successCount = 0;
    let failCount = 0;

    for (const w of pendingWinners) {
      try {
        const res = await fetch("/api/admin/award-badge", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            traderId: String(w.id),
            traderName: w.name,
            badgeName: evaluatingBadge,
            points: proposedRule?.points || 0,
            period: evalPeriod,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        failCount++;
      }
    }

    setSuccessMsg(`Batch award complete: Successfully awarded ${successCount} badges. ${failCount > 0 ? `Failed: ${failCount}` : ""}`);
    await fetchBadgesData();
    setIsAwardingAll(false);
  };

  // Calculations for stats
  const totalRegistered = traders.length;
  const totalNetDeposits = traders.reduce((acc, t) => acc + (t.totalNetDeposits || 0), 0);
  const totalDisqualified = traders.filter(t => t.isWashedOut).length;

  // Filtered list
  const filteredTraders = traders.filter(t => {
    const query = searchQuery.toLowerCase();
    return (
      t.clientName.toLowerCase().includes(query) ||
      t.clientId.toLowerCase().includes(query) ||
      String(t.numericId || "").includes(query)
    );
  });

  // Render Login
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-950">
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-brand-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Center</h1>
            <p className="text-slate-400 text-sm mt-2">Enter credentials to manage your leaderboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3 rounded-xl text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-xl shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              Access Dashboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              TT
            </div>
            <div>
              <span className="font-bold text-white block">Trade Talks</span>
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Admin Console</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("traders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "traders"
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Users className="w-5 h-5" />
              Registered Traders
              <span className="ml-auto bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                {totalRegistered}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("badges")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "badges"
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Award className="w-5 h-5" />
              Badge Rules
            </button>
            <button
              onClick={() => setActiveTab("liveSearch")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "liveSearch"
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Search className="w-5 h-5" />
              Live API Search
            </button>
            <button
              onClick={() => {
                setActiveTab("registrations");
                fetchRegistrations();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "registrations"
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              Registrations
              <span className="ml-auto bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                {registrations.length || ""}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("promoted");
                fetchWinnerPromotions();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "promoted"
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Trophy className="w-5 h-5 text-brand-450" />
              Promoted Winners
              <span className="ml-auto bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full">
                {winnerPromotions.length || ""}
              </span>
            </button>
            <button
              onClick={() => {
                setActiveTab("pointsHistory");
                fetchPointsHistory();
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === "pointsHistory"
                  ? "bg-brand-600/15 text-brand-400 border border-brand-500/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Award className="w-5 h-5 text-amber-500" />
              Points History
            </button>
          </nav>
        </div>

        {/* User / Logout */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Banner Alert Messages */}
        {errorMsg && (
          <div className="mb-6 flex items-center justify-between text-rose-400 bg-rose-500/10 border border-rose-500/20 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg("")} className="hover:opacity-85 text-slate-400"><X className="w-4 h-4" /></button>
          </div>
        )}
        {successMsg && (
          <div className="mb-6 flex items-center justify-between text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3.5 rounded-xl text-sm animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg("")} className="hover:opacity-85 text-slate-400"><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white">System Status</h1>
              <p className="text-slate-400 text-sm mt-1">Key metrics and administration controls</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              
              {/* Card 1 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-4 right-4 w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-brand-400" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Registered Traders</span>
                <span className="block text-4xl font-extrabold text-white mt-2">{totalRegistered}</span>
                <span className="text-slate-500 text-xs mt-1 block">Active on the leaderboard</span>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Total Net Deposits</span>
                <span className="block text-4xl font-extrabold text-white mt-2">
                  ${totalNetDeposits.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-slate-500 text-xs mt-1 block">Registration deposit sum</span>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-4 right-4 w-10 h-10 bg-rose-500/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <span className="text-slate-400 text-sm font-medium">Disqualified Traders</span>
                <span className="block text-4xl font-extrabold text-white mt-2">{totalDisqualified}</span>
                <span className="text-slate-500 text-xs mt-1 block">Disqualified due to washout (&le;$1.00)</span>
              </div>

            </div>

            {/* Sync Controls & Cron History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Force API Sync */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-5 h-5 text-brand-400" />
                    <h3 className="font-bold text-white text-lg">Alpari API Synchronization</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    Manually retrieve fresh statistics and balances for all registered accounts from the Alpari insights portal. This updates cache records and refreshes the leaderboard immediately.
                  </p>
                </div>
                <button
                  onClick={handleSync}
                  disabled={syncing}
                  className="w-full sm:w-auto self-start px-6 py-3 bg-brand-600 hover:bg-brand-550 disabled:bg-slate-800 text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                  {syncing ? "Synchronizing Data..." : "Force Real-Time Sync"}
                </button>
              </div>

              {/* Cron History Log */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-white text-lg">Cron Sync Logs</h3>
                  </div>
                  <button
                    onClick={fetchCronHistory}
                    disabled={loadingCronHistory}
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                    title="Refresh Cron History"
                  >
                    <RefreshCw className={`w-4 h-4 ${loadingCronHistory ? "animate-spin" : ""}`} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[220px] pr-1 space-y-2">
                  {loadingCronHistory && cronHistory.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-brand-500"></div>
                      <span className="text-slate-500 text-xs">Fetching history...</span>
                    </div>
                  ) : cronHistory.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-xs">
                      No automated cron job executions recorded yet.
                    </div>
                  ) : (
                    cronHistory.map((log: any, idx: number) => (
                      <div key={log._id || idx} className="flex items-center justify-between p-3 bg-slate-950/45 border border-slate-850 rounded-xl hover:border-slate-800 transition-all">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              log.status === "success" 
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15" 
                                : "bg-rose-500/10 text-rose-450 border border-rose-500/15"
                            }`}>
                              {log.status.toUpperCase()}
                            </span>
                            {log.status === "success" && (
                              <span className="text-slate-400 text-[10px]">
                                Synced {log.syncedCount ?? 0} traders
                              </span>
                            )}
                          </div>
                          {log.error && (
                            <span className="text-rose-405 text-[10px] block font-mono max-w-[280px] overflow-hidden text-ellipsis whitespace-nowrap" title={log.error}>
                              {log.error}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 text-[10px] font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{" "}
                          {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: '2-digit' })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TRADERS LIST TAB */}
        {activeTab === "traders" && (
          <div className="space-y-6">
            
            {/* Header + Search bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Registered Users</h1>
                <p className="text-slate-400 text-sm mt-1">Manage trader deposits and qualification status</p>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or ID..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            {/* Traders Table Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                  <span className="text-slate-400 text-sm">Loading database entries...</span>
                </div>
              ) : filteredTraders.length === 0 ? (
                <div className="py-20 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-slate-300 font-bold text-lg">No traders found</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {searchQuery ? "Try refining your search query." : "Register verified users first."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/35">
                        <th className="px-6 py-4">Trader Info</th>
                        <th className="px-6 py-4">Country</th>
                        <th className="px-6 py-4 text-right">Net Deposit</th>
                        <th className="px-6 py-4 text-right">Current Balance</th>
                        <th className="px-6 py-4 text-right">ROI / Profit</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-800/60">
                      {filteredTraders.map((t) => (
                        <tr key={t.clientId} className="hover:bg-slate-800/25 transition-all">
                          
                          {/* Info */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.clientName)}`}
                                alt={t.clientName}
                                className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/50"
                              />
                              <div>
                                <span className="font-semibold text-white block text-sm">{t.clientName}</span>
                                <span className="text-slate-500 text-xs block font-mono">ID: {t.clientId}</span>
                              </div>
                            </div>
                          </td>

                          {/* Country */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-300 text-sm">
                              <Globe className="w-3.5 h-3.5 text-slate-500" />
                              <span>{t.country}</span>
                            </div>
                          </td>

                          {/* Net Deposit */}
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 font-semibold text-white text-sm">
                              <span>${t.totalNetDeposits.toFixed(2)}</span>
                              <button
                                onClick={() => {
                                  setEditingTrader(t);
                                  setNewDepositAmount(String(t.totalNetDeposits));
                                }}
                                className="text-slate-500 hover:text-brand-400 p-1 rounded hover:bg-slate-800 transition-all cursor-pointer"
                                title="Edit Net Deposit"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Current Balance */}
                          <td className="px-6 py-4 text-right">
                            <span className="text-slate-300 text-sm font-medium">
                              ${(t.lastRecordedBalance ?? 0).toFixed(2)}
                            </span>
                          </td>

                          {/* ROI */}
                          <td className="px-6 py-4 text-right">
                            <div className={`flex items-center justify-end gap-1 text-sm font-bold ${
                              (t.profit ?? 0) > 0 ? "text-emerald-400" : (t.profit ?? 0) < 0 ? "text-rose-400" : "text-slate-400"
                            }`}>
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>{(t.profit ?? 0) > 0 ? "+" : ""}{(t.profit ?? 0).toFixed(2)}%</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              t.isWashedOut
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            }`}>
                              {t.isWashedOut ? "Disqualified" : "Qualified"}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              {/* Toggle Disqualification */}
                              <button
                                onClick={() => handleToggleDisqualification(t)}
                                className={`text-xs px-2.5 py-1 border rounded-lg font-medium transition-all cursor-pointer ${
                                  t.isWashedOut
                                    ? "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400"
                                    : "bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400"
                                }`}
                              >
                                {t.isWashedOut ? "Re-qualify" : "Disqualify"}
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleUnregister(t.clientId, t.clientName)}
                                className="text-slate-500 hover:text-rose-400 p-2 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
                                title="Unregister Trader"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              )}

            </div>

          </div>
        )}

        {/* BADGES TAB */}
        {activeTab === "badges" && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                <Award className="w-8 h-8 text-brand-400" />
                Badge Rules & Evaluation
              </h1>
              <p className="text-slate-400 text-sm mt-1">Configure challenge parameters, run evaluations, and approve badge awards</p>
            </div>

            {/* Global Eligibility Config Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold text-white text-lg">Global Badge Eligibility Rules</h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Configure global requirements for challenge badges. Changing these settings invalidates the leaderboard cache immediately.
              </p>

              <form onSubmit={handleSaveGlobalSettings} className="grid grid-cols-1 sm:grid-cols-3 items-end gap-4">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Min Volume Standard (Lots per $100 net deposits)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={globalSettings.minVolumePer100NetDeposits}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, minVolumePer100NetDeposits: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2">
                    Washout Equity Threshold (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={globalSettings.minEquityForWashout}
                    onChange={(e) => setGlobalSettings({ ...globalSettings, minEquityForWashout: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingGlobalSettings}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-550 disabled:bg-slate-850 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer h-10"
                >
                  {savingGlobalSettings ? "Saving Settings..." : "Save Eligibility Settings"}
                </button>
              </form>
            </div>

            {/* Evaluation Results Panel */}
            {evaluatingBadge && (
              <div className="bg-slate-900 border border-brand-500/20 shadow-brand-500/5 rounded-2xl p-6 relative overflow-hidden shadow-2xl animate-slideDown">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <span className="text-brand-400 text-xs font-semibold uppercase tracking-wider">Evaluation Live Run</span>
                    <h3 className="text-xl font-bold text-white mt-1">Proposed Winners for: {evaluatingBadge}</h3>
                    <p className="text-slate-400 text-xs mt-1">
                      Rule Criteria: {proposedRule ? `${proposedRule.metric} ${proposedRule.operator === "gte" ? ">=" : "<="} ${proposedRule.value}` : ""} | Value: {proposedRule?.points} Points
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEvaluatingBadge(null);
                      setProposedWinners([]);
                    }}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Period Setting & Batch Actions */}
                <div className="flex flex-col sm:flex-row items-end gap-4 mb-6 bg-slate-950/40 p-4 border border-slate-800 rounded-xl">
                  <div className="flex-1 w-full max-w-xs">
                    <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-brand-400" />
                      Evaluation Period Key (e.g. Month, Week, or Season)
                    </label>
                    <input
                      type="text"
                      value={evalPeriod}
                      onChange={(e) => setEvalPeriod(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
                      placeholder="e.g. 2026-M07, 2026-W30, Season 1"
                    />
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => handleEvaluateBadge(evaluatingBadge)}
                      disabled={isEvaluating}
                      className="px-4 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:border-slate-650 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isEvaluating ? "animate-spin" : ""}`} />
                      Re-evaluate
                    </button>
                    
                    {proposedWinners.length > 0 && (
                      <button
                        onClick={handleAwardAllProposed}
                        disabled={isAwardingAll}
                        className="px-4 py-2.5 bg-brand-600 hover:bg-brand-550 disabled:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-600/10"
                      >
                        <Check className="w-4 h-4" />
                        {isAwardingAll ? "Awarding All..." : "Approve & Award All Candidates"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Winners list */}
                {isEvaluating ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                    <span className="text-slate-400 text-sm">Evaluating traders list against criteria...</span>
                  </div>
                ) : proposedWinners.length === 0 ? (
                  <div className="py-8 bg-slate-950/30 rounded-xl border border-dashed border-slate-800 text-center">
                    <Users className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                    <p className="text-slate-400 text-sm font-medium">No traders met the badge's rule criteria currently.</p>
                    <p className="text-slate-500 text-xs mt-0.5">Traders need to satisfy the rule condition to be listed as proposed winners.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/20">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-950/40">
                          <th className="px-4 py-3">Trader</th>
                          <th className="px-4 py-3 text-right">Value (Profit/Volume/Rebates)</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        {proposedWinners.map((w) => {
                          // Determine what metric value to show
                          let metricVal = "";
                          if (proposedRule?.metric === "profit") metricVal = `${(w.profit ?? 0).toFixed(2)}%`;
                          else if (proposedRule?.metric === "volume") metricVal = `${(w.volume ?? 0).toFixed(2)} Lots`;
                          else if (proposedRule?.metric === "settledRebates") metricVal = `$${(w.settledRebates ?? 0).toFixed(2)}`;
                          else if (proposedRule?.metric === "totalBalance") metricVal = `$${(w.totalBalance ?? 0).toFixed(2)}`;
                          else if (proposedRule?.metric === "points") metricVal = `${w.totalPoints ?? 0} Points`;
                          else if (proposedRule?.metric === "avgPoints") metricVal = `${((w.totalPoints ?? 0) / 6).toFixed(1)} Pts/mo`;
                          else if (proposedRule?.metric === "avgVolume") metricVal = `${((w.volume ?? 0) / 6).toFixed(2)} Lots/mo`;
                          else if (proposedRule?.metric === "avgProfit") metricVal = `${((w.profit ?? 0) / 6).toFixed(2)}%/mo`;
                          
                          const isAwarded = awardedBadges.some(
                            (ab) => ab.traderId === String(w.id) && ab.badgeName === evaluatingBadge && ab.period === evalPeriod && ab.approved
                          );

                          return (
                            <tr key={w.id} className="hover:bg-slate-800/10">
                              <td className="px-4 py-3 font-medium text-white">{w.name} <span className="text-slate-500 text-xs font-mono">(ID: {w.id})</span></td>
                              <td className="px-4 py-3 text-right text-slate-300">{metricVal}</td>
                              <td className="px-4 py-3 text-center">
                                {isAwarded ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                                    <Check className="w-3 h-3" />
                                    Awarded & Displayed
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleAwardBadge(w)}
                                    disabled={awardingTraderId === w.id}
                                    className="px-3 py-1 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                                  >
                                    {awardingTraderId === w.id ? "Awarding..." : "Approve & Award Badge"}
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Grid for Rules and History */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Rules List (Left 7 Columns) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Challenge Badges & Rules</h2>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingRule({
                          _id: "",
                          points: 50,
                          description: "",
                          displayRules: "",
                          conditions: [{ metric: "profit", operator: "gte", value: 0 }],
                          nextEvaluationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                          icon: "shield_green",
                          cashPrize: "",
                          isNew: true
                        });
                      }}
                      className="px-3.5 py-2 bg-brand-600 hover:bg-brand-550 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Badge
                    </button>
                    {loadingBadges && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-brand-500"></div>}
                  </div>
                </div>

                <div className="space-y-4">
                  {badgeRules.map((rule) => (
                    <div key={rule._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 p-1 bg-slate-950 rounded-xl border border-slate-800">
                          {renderBadgeIcon(rule.icon || rule._id, "w-10 h-10")}
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold text-white text-base">{rule._id}</h3>
                            <span className="bg-slate-800 text-brand-450 text-xs px-2 py-0.5 rounded border border-brand-500/20 font-bold">
                              +{rule.points} Points
                            </span>
                            {rule.cashPrize && (
                              <span className="bg-emerald-950 text-emerald-400 text-xs px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-0.5">
                                <span className="font-semibold text-[10px]">₹</span>
                                {rule.cashPrize} Prize
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs leading-relaxed max-w-md">{rule.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 text-slate-500 text-xs">
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-slate-400">Rules:</span>
                            <span className="text-slate-300">
                              {rule.conditions && Array.isArray(rule.conditions) && rule.conditions.length > 0 ? (
                                rule.conditions.map((cond: any, idx: number) => {
                                  const opSign = cond.operator === "gte" ? "≥" : cond.operator === "lte" ? "≤" : cond.operator === "gt" ? ">" : cond.operator === "lt" ? "<" : "=";
                                  return `${idx > 0 ? " & " : ""}${cond.metric} ${opSign} ${cond.value}`;
                                }).join("")
                              ) : (
                                `${rule.metric} ${rule.operator === "gte" ? "≥" : "≤"} ${rule.value}`
                              )}
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>Eval: {rule.nextEvaluationTime ? new Date(rule.nextEvaluationTime).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }) : "N/A"}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                      <div className="flex items-center gap-2 self-end md:self-center">
                        <button
                          onClick={() => {
                            const initialRule = { ...rule };
                            if (!initialRule.conditions || !Array.isArray(initialRule.conditions)) {
                              initialRule.conditions = [{
                                metric: initialRule.metric || "profit",
                                operator: initialRule.operator || "gte",
                                value: initialRule.value ?? 0
                              }];
                            }
                            if (!initialRule.displayRules) {
                              initialRule.displayRules = "";
                            }
                            setEditingRule(initialRule);
                          }}
                          className="p-2 bg-slate-800 hover:bg-slate-755 text-slate-300 hover:text-white rounded-xl border border-slate-750 transition-all cursor-pointer"
                          title="Edit Rule & Points"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEvaluateBadge(rule._id)}
                          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Evaluate & Award Winners"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Evaluate Winners
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Award history (Right 5 Columns) */}
              <div className="lg:col-span-5 space-y-6">

                {/* Manually Award Badge Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Plus className="w-4 h-4 text-brand-400" />
                    Manually Award Badge
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Directly assign a badge to any qualified trader without running automated evaluation rules.
                  </p>
                  
                  <form onSubmit={handleManualAwardSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Select Trader <span className="text-rose-400">*</span>
                      </label>
                      <select
                        required
                        value={manualAward.traderId}
                        onChange={(e) => setManualAward({ ...manualAward, traderId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                      >
                        <option value="">Choose a trader...</option>
                        {traders.map((t) => (
                          <option key={t.clientId} value={t.clientId}>
                            {t.clientName} (ID: {t.clientId})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Select Badge <span className="text-rose-400">*</span>
                        </label>
                        <select
                          required
                          value={manualAward.badgeName}
                          onChange={(e) => {
                            const badge = badgeRules.find(r => r._id === e.target.value);
                            setManualAward({
                              ...manualAward,
                              badgeName: e.target.value,
                              points: badge ? badge.points : 50
                            });
                          }}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                        >
                          <option value="">Choose badge...</option>
                          {badgeRules.map((r) => (
                            <option key={r._id} value={r._id}>
                              {r._id}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Points
                        </label>
                        <input
                          type="number"
                          required
                          value={manualAward.points}
                          onChange={(e) => setManualAward({ ...manualAward, points: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Period Key
                      </label>
                      <input
                        type="text"
                        required
                        value={manualAward.period}
                        onChange={(e) => setManualAward({ ...manualAward, period: e.target.value })}
                        placeholder="e.g. Season 1, 2026-W30"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAwardingManual || !manualAward.traderId || !manualAward.badgeName}
                      className="w-full py-2.5 bg-brand-600 hover:bg-brand-550 disabled:bg-slate-850 disabled:text-slate-500 text-white font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {isAwardingManual ? "Awarding..." : "Award Badge & Point"}
                    </button>
                  </form>
                </div>

                <h2 className="text-xl font-bold text-white">Approved Award Log</h2>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
                  {awardedBadges.length === 0 ? (
                    <div className="py-12 text-center text-slate-500 text-sm">
                      <Award className="w-10 h-10 text-slate-750 mx-auto mb-2" />
                      No badges awarded yet for this challenge season.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {awardedBadges.map((badge, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl hover:border-slate-800 transition-all">
                          <div>
                            <span className="font-semibold text-white block text-sm">{badge.traderName}</span>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-brand-400 text-xs font-bold">{badge.badgeName}</span>
                              <span className="text-slate-500 text-[10px] bg-slate-800 px-1.5 py-0.5 rounded font-mono uppercase">
                                {badge.period}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleRevokeBadge(badge)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all cursor-pointer"
                            title="Revoke Badge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* LIVE SEARCH TAB */}
        {activeTab === "liveSearch" && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-3xl font-bold text-white">Live API Search</h1>
              <p className="text-slate-400 text-sm mt-1">Search any trader in real-time to view their live Alpari API metrics</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <form onSubmit={handleLiveSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={liveSearchQuery}
                    onChange={(e) => setLiveSearchQuery(e.target.value)}
                    placeholder="Search by name, Client ID (e.g. f026...), or Numeric ID (e.g. 420...)"
                    className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searchingLive}
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-850 text-white font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${searchingLive ? "animate-spin" : ""}`} />
                  {searchingLive ? "Searching..." : "Search Live API"}
                </button>
              </form>
            </div>

            {/* Results Table Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {searchingLive ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                  <span className="text-slate-400 text-sm">Querying Alpari API...</span>
                </div>
              ) : liveSearchResults.length === 0 ? (
                <div className="py-20 text-center">
                  <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-slate-300 font-bold text-lg">No metrics found</h3>
                  <p className="text-slate-500 text-sm mt-1">
                    {liveSearchQuery ? "No matching clients found in live API data." : "Enter a search query to search live trader metrics."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/35">
                        <th className="px-6 py-4">Trader Info</th>
                        <th className="px-6 py-4 text-right">Lots Traded</th>
                        <th className="px-6 py-4 text-right">Balance</th>
                        <th className="px-6 py-4 text-right">Equity</th>
                        <th className="px-6 py-4 text-right">Profit ROI</th>
                        <th className="px-6 py-4 text-center">Registration</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {liveSearchResults.map((trader: any) => {
                        const isUnderVolume = (trader.volume ?? 0) < ((trader.mtNetDeposits ?? 0) / 100) * 0.6;
                        return (
                          <tr key={trader.id} className="hover:bg-slate-800/10">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-white">{trader.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                ID: {trader.id} {trader.internalId ? `| Num ID: ${trader.internalId}` : ""}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-1">
                                Country: {trader.country}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-350">
                              {(trader.volume ?? 0).toFixed(2)} Lots
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-300">
                              ${(trader.totalBalance ?? 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right font-medium text-slate-300">
                              ${(trader.totalEquity ?? 0).toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-right font-bold">
                              <span className={trader.profit >= 0 ? "text-emerald-400" : "text-rose-400"}>
                                {trader.profit >= 0 ? "+" : ""}{(trader.profit ?? 0).toFixed(2)}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {trader.isRegistered ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                  Registered
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-400">
                                  Unregistered
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              {trader.isWashedOut ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                  Disqualified
                                </span>
                              ) : isUnderVolume ? (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 border border-amber-500/20 text-amber-400" title="Does not meet volume requirement (0.6 lots per $100 net deposits)">
                                  Under Volume
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => {
                                  setEditingWinner({
                                    name: trader.name || "",
                                    challengeName: "Weekly Challenge Winner",
                                    description: "",
                                    rank: 1,
                                    photo: "",
                                    clientId: trader.id || "",
                                    enabled: true
                                  });
                                  setActiveTab("promoted");
                                }}
                                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-550 text-white text-[10px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 mx-auto shadow-md cursor-pointer"
                              >
                                <Trophy className="w-3 h-3" />
                                Promote as Winner
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTRATIONS TAB */}
        {activeTab === "registrations" && (
          <div className="space-y-6 animate-fadeIn">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-7 h-7 text-brand-400" />
                  Registrations
                </h1>
                <p className="text-slate-400 text-sm mt-1">All trader registration submissions from the website</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={fetchRegistrations}
                  disabled={loadingRegistrations}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingRegistrations ? "animate-spin" : ""}`} />
                  Refresh
                </button>
                <button
                  onClick={exportToExcel}
                  disabled={registrations.length === 0}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-700/20"
                >
                  <Download className="w-4 h-4" />
                  Export to Excel
                </button>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={regSearchQuery}
                onChange={(e) => setRegSearchQuery(e.target.value)}
                placeholder="Search by name, phone, or city..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Registrations", value: registrations.length, color: "text-brand-400" },
                { label: "With Email", value: registrations.filter(r => r.email).length, color: "text-violet-400" },
                { label: "From Kerala", value: registrations.filter(r => (r.state || "").toLowerCase().includes("kerala")).length, color: "text-emerald-400" },
                { label: "Via Instagram", value: registrations.filter(r => r.howHeard === "Instagram").length, color: "text-pink-400" },
              ].map((stat) => (
                <div key={stat.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                  <span className={`text-2xl font-extrabold block ${stat.color}`}>{stat.value}</span>
                  <span className="text-slate-400 text-xs mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Registrations Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {loadingRegistrations ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                  <span className="text-slate-400 text-sm">Loading registrations...</span>
                </div>
              ) : (() => {
                const filtered = registrations.filter((r) => {
                  const q = regSearchQuery.toLowerCase();
                  return (
                    (r.fullName || r.clientName || "").toLowerCase().includes(q) ||
                    (r.phone || "").toLowerCase().includes(q) ||
                    (r.city || "").toLowerCase().includes(q) ||
                    (r.email || "").toLowerCase().includes(q) ||
                    (r.clientId || "").toLowerCase().includes(q)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-20 text-center">
                      <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <h3 className="text-slate-300 font-bold text-lg">No registrations found</h3>
                      <p className="text-slate-500 text-sm mt-1">
                        {regSearchQuery ? "Try a different search query." : "No traders have registered yet."}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/35">
                          <th className="px-5 py-4">#</th>
                          <th className="px-5 py-4">Trader</th>
                          <th className="px-5 py-4">Contact</th>
                          <th className="px-5 py-4">Location</th>
                          <th className="px-5 py-4">Experience</th>
                          <th className="px-5 py-4">Source</th>
                          <th className="px-5 py-4">Registered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filtered.map((r, idx) => (
                          <tr key={r._id || idx} className="hover:bg-slate-800/20 transition-all">
                            <td className="px-5 py-4 text-slate-500 text-xs font-mono">{idx + 1}</td>

                            {/* Trader */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(r.fullName || r.clientName || "T")}`}
                                  alt={r.fullName}
                                  className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/50 shrink-0"
                                />
                                <div>
                                  <span className="font-semibold text-white block text-sm">{r.fullName || r.clientName}</span>
                                  <span className="text-slate-500 text-xs font-mono">ID: {r.clientId}</span>
                                </div>
                              </div>
                            </td>

                            {/* Contact */}
                            <td className="px-5 py-4">
                              <div className="space-y-1">
                                {r.phone && (
                                  <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                                    <Phone className="w-3 h-3 text-slate-500" />
                                    {r.phone}
                                  </div>
                                )}
                                {r.email && (
                                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                                    <Mail className="w-3 h-3 text-slate-500" />
                                    {r.email}
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Location */}
                            <td className="px-5 py-4">
                              {(r.city || r.state) ? (
                                <div className="flex items-center gap-1.5 text-slate-300 text-xs">
                                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                                  {[r.city, r.state].filter(Boolean).join(", ")}
                                </div>
                              ) : (
                                <span className="text-slate-600 text-xs">—</span>
                              )}
                            </td>

                            {/* Experience */}
                            <td className="px-5 py-4">
                              {r.experience ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 border border-violet-500/20 text-violet-400">
                                  {r.experience.split("(")[0].trim()}
                                </span>
                              ) : (
                                <span className="text-slate-600 text-xs">—</span>
                              )}
                            </td>

                            {/* Source */}
                            <td className="px-5 py-4">
                              {r.howHeard ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-400">
                                  {r.howHeard}
                                </span>
                              ) : (
                                <span className="text-slate-600 text-xs">—</span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="px-5 py-4 text-slate-400 text-xs">
                              {r.submittedAt
                                ? new Date(r.submittedAt).toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-5 py-3 border-t border-slate-800 text-slate-500 text-xs">
                      Showing {filtered.length} of {registrations.length} registrations
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* PROMOTED WINNERS TAB */}
        {activeTab === "promoted" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-7 h-7 text-brand-400" />
                  Promoted Winners Showcase
                </h1>
                <p className="text-slate-400 text-sm mt-1">Feature outstanding challenge winners directly on the storefront pages</p>
              </div>
              <button
                onClick={() => {
                  setEditingWinner({
                    name: "",
                    challengeName: "Weekly Challenge Winner",
                    description: "",
                    rank: 1,
                    photo: "",
                    clientId: "",
                    enabled: true
                  });
                }}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-550 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-brand-600/10"
              >
                <Plus className="w-4 h-4" />
                Add Featured Winner
              </button>
            </div>

            {/* Winners Grid */}
            {loadingWinners ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                <span className="text-slate-400 text-sm">Loading winners showcase...</span>
              </div>
            ) : winnerPromotions.length === 0 ? (
              <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-2xl">
                <Trophy className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <h3 className="text-slate-350 font-bold text-lg">No promoted winners yet</h3>
                <p className="text-slate-500 text-sm mt-1">Click the button to add a new winner promotion highlight.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {winnerPromotions.map((winner) => (
                  <div key={winner._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all shadow-xl">
                    
                    {/* Status Toggle & Action Controls */}
                    <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800/60">
                      <button
                        onClick={() => handleToggleWinnerEnabled(winner._id, winner.enabled)}
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border transition-all cursor-pointer ${
                          winner.enabled
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-800 text-slate-500 border-slate-700"
                        }`}
                      >
                        {winner.enabled ? "Visible" : "Hidden"}
                      </button>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingWinner({ ...winner })}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-all cursor-pointer"
                          title="Edit Winner Detail"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteWinner(winner._id)}
                          className="p-1 bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 rounded transition-all cursor-pointer"
                          title="Delete Showcase Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      {/* Avatar Image + Info */}
                      <div className="flex items-center gap-4 mb-4">
                        {winner.photo ? (
                          <img
                            src={winner.photo}
                            alt={winner.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-950 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-slate-850 flex items-center justify-center text-slate-500 font-bold shrink-0">
                            {winner.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-white text-sm">{winner.name}</h4>
                          <p className="text-[10px] text-slate-400">{winner.challengeName}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-[9px] font-bold text-amber-400 bg-amber-500/5 px-1 rounded">Rank: {winner.rank || "1"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description / Review Quote */}
                      <p className="text-xs text-slate-300 italic bg-slate-950/30 p-3 rounded-xl border border-slate-800/40 mt-2">
                        &ldquo;{winner.description}&rdquo;
                      </p>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* EDIT WINNER MODAL */}
            {editingWinner && (
              <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
                <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
                  
                  <button
                    onClick={() => setEditingWinner(null)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-lg font-bold text-white mb-1">
                    {editingWinner._id ? "Edit Winner Details" : "Create Featured Winner"}
                  </h3>
                  <p className="text-slate-400 text-xs mb-6">
                    Enter the details and upload a photo to highlight this trader on the public storefront showcase.
                  </p>

                  <form onSubmit={handleSaveWinner} className="space-y-4">
                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                        Winner Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingWinner.name}
                        onChange={(e) => setEditingWinner({ ...editingWinner, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                        placeholder="e.g. Adarsh Kumar"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                        External Client ID
                      </label>
                      <input
                        type="text"
                        value={editingWinner.clientId || ""}
                        onChange={(e) => setEditingWinner({ ...editingWinner, clientId: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                        placeholder="e.g. f02611... or 420556..."
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                        Challenge Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editingWinner.challengeName}
                        onChange={(e) => setEditingWinner({ ...editingWinner, challengeName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                        placeholder="e.g. Weekly Challenge"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                          Rank Key
                        </label>
                        <input
                          type="number"
                          required
                          value={editingWinner.rank}
                          onChange={(e) => setEditingWinner({ ...editingWinner, rank: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                          Visible on storefront
                        </label>
                        <select
                          value={editingWinner.enabled ? "true" : "false"}
                          onChange={(e) => setEditingWinner({ ...editingWinner, enabled: e.target.value === "true" })}
                          className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                        >
                          <option value="true">Yes, show on website</option>
                          <option value="false">No, hide for now</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                        Winner Image (Photo Upload)
                      </label>
                      <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
                        {editingWinner.photo ? (
                          <img
                            src={editingWinner.photo}
                            alt="preview"
                            className="w-12 h-12 rounded-lg object-cover border border-slate-800"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-850 flex items-center justify-center text-slate-550 text-xs font-bold border border-dashed border-slate-700">
                            No Pic
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/jpeg,image/jpg"
                            onChange={handlePhotoUpload}
                            className="text-xs text-slate-400 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-brand-600/20 file:text-brand-400 hover:file:bg-brand-600/30 cursor-pointer"
                          />
                          <span className="text-[9px] text-slate-500 block mt-1">Only JPG/JPEG images under 100KB allowed.</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                        Quote / Review / Description
                      </label>
                      <textarea
                        required
                        value={editingWinner.description}
                        onChange={(e) => setEditingWinner({ ...editingWinner, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs leading-relaxed"
                        placeholder="Describe the winner's journey, ROI success, or feedback quotes..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setEditingWinner(null)}
                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all cursor-pointer text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={savingWinner}
                        className="flex-1 py-3 bg-brand-600 hover:bg-brand-550 disabled:bg-slate-850 text-white font-medium rounded-xl shadow-lg transition-all cursor-pointer text-xs font-bold"
                      >
                        {savingWinner ? "Saving..." : "Save Showcase Card"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* POINTS HISTORY TAB */}
        {activeTab === "pointsHistory" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                  <Trophy className="w-7 h-7 text-amber-500" />
                  Trader Points History
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Accrued point aggregates and badge breakdown per trader rankings
                </p>
              </div>
              <button
                onClick={() => fetchPointsHistory(true)}
                disabled={loadingPointsHistory || refreshingPointsHistory}
                className="px-4 py-2.5 bg-brand-600 hover:bg-brand-550 disabled:bg-slate-800 text-white text-sm font-medium rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-brand-600/10"
              >
                <RefreshCw className={`w-4 h-4 ${(loadingPointsHistory || refreshingPointsHistory) ? "animate-spin" : ""}`} />
                {refreshingPointsHistory ? "Refreshing..." : "Refresh Points"}
              </button>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={pointsSearchQuery}
                onChange={(e) => setPointsSearchQuery(e.target.value)}
                placeholder="Search by trader name or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
              />
            </div>

            {/* Table of points */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              {loadingPointsHistory && pointsHistory.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-500"></div>
                  <span className="text-slate-400 text-sm">Loading points history...</span>
                </div>
              ) : (() => {
                const filtered = pointsHistory.filter((t) => {
                  const q = pointsSearchQuery.toLowerCase();
                  return (
                    (t.name || "").toLowerCase().includes(q) ||
                    (t.clientId || "").toLowerCase().includes(q)
                  );
                });

                if (filtered.length === 0) {
                  return (
                    <div className="py-20 text-center">
                      <Trophy className="w-12 h-12 text-slate-650 mx-auto mb-3" />
                      <h3 className="text-slate-350 font-bold text-lg">No points records found</h3>
                      <p className="text-slate-500 text-sm mt-1">
                        {pointsSearchQuery ? "Try refining your search query." : "No points accumulated yet. Award some badges!"}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/35">
                          <th className="px-6 py-4 text-center w-20">Rank</th>
                          <th className="px-6 py-4">Trader Info</th>
                          <th className="px-6 py-4">Country</th>
                          <th className="px-6 py-4 text-center">Badges Count</th>
                          <th className="px-6 py-4">Earned Badges</th>
                          <th className="px-6 py-4 text-right">ROI / Profit</th>
                          <th className="px-6 py-4 text-right pr-8">Total Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {filtered.map((t) => (
                          <tr key={t.clientId} className="hover:bg-slate-800/20 transition-all">
                            {/* Rank */}
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                t.pointsRank === 1
                                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                  : t.pointsRank === 2
                                  ? "bg-slate-300/20 text-slate-300 border border-slate-300/30"
                                  : t.pointsRank === 3
                                  ? "bg-amber-700/20 text-amber-600 border border-amber-700/30"
                                  : "text-slate-400 bg-slate-950/30 border border-slate-800/50"
                              }`}>
                                #{t.pointsRank}
                              </span>
                            </td>

                            {/* Info */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={t.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.name)}`}
                                  alt={t.name}
                                  className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700/50 shrink-0"
                                />
                                <div>
                                  <span className="font-semibold text-white block text-sm">{t.name}</span>
                                  <span className="text-slate-500 text-xs font-mono">ID: {t.clientId}</span>
                                </div>
                              </div>
                            </td>

                            {/* Country */}
                            <td className="px-6 py-4">
                              <span className="text-slate-300 text-sm">{t.country || "India"}</span>
                            </td>

                            {/* Badges count */}
                            <td className="px-6 py-4 text-center">
                              <span className="text-slate-200 font-bold bg-slate-950/40 px-2.5 py-1 rounded-lg border border-slate-805 text-xs">
                                {t.earnedBadges.length}
                              </span>
                            </td>

                            {/* Earned Badges */}
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1.5 max-w-xs">
                                {t.earnedBadges.length === 0 ? (
                                  <span className="text-slate-550 text-xs italic">—</span>
                                ) : (
                                  t.earnedBadges.map((badgeName: string, index: number) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-semibold bg-brand-500/10 border border-brand-500/20 text-brand-400"
                                    >
                                      {renderBadgeIcon(badgeName, "w-3 h-3")}
                                      {badgeName}
                                    </span>
                                  ))
                                )}
                              </div>
                            </td>

                            {/* ROI */}
                            <td className="px-6 py-4 text-right">
                              <span className={`text-sm font-bold ${
                                (t.profit ?? 0) > 0 ? "text-emerald-400" : (t.profit ?? 0) < 0 ? "text-rose-400" : "text-slate-400"
                              }`}>
                                {(t.profit ?? 0) > 0 ? "+" : ""}{(t.profit ?? 0).toFixed(2)}%
                              </span>
                            </td>

                            {/* Total Points */}
                            <td className="px-6 py-4 text-right pr-8">
                              <span className="text-amber-400 font-extrabold text-base">
                                {t.totalPoints} pts
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

      </main>

      {/* EDIT DEPOSIT MODAL */}
      {editingTrader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            
            <button
              onClick={() => setEditingTrader(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Trader Deposit Management</h3>
            <p className="text-slate-400 text-xs mb-4">
              Managing deposits for <strong className="text-slate-200">{editingTrader.clientName}</strong> (Current Balance: ${(editingTrader.lastRecordedBalance ?? 0).toFixed(2)})
            </p>

            {/* Mode Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 mb-5">
              <button
                type="button"
                onClick={() => setDepositUpdateMode("baseline")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  depositUpdateMode === "baseline"
                    ? "bg-brand-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Baseline Deposit (Fix Initial Capital)
              </button>
              <button
                type="button"
                onClick={() => setDepositUpdateMode("cash_flow")}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  depositUpdateMode === "cash_flow"
                    ? "bg-brand-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                ⚡ Simulate TWR Cash Flow
              </button>
            </div>

            <form onSubmit={handleUpdateDeposit} className="space-y-4">
              {depositUpdateMode === "baseline" ? (
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Total Starting Net Deposit (USD)
                  </label>
                  <p className="text-slate-500 text-[11px] mb-2">
                    Re-baselines the initial starting capital. Use this if the initial deposit was recorded incorrectly.
                  </p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newDepositAmount}
                      onChange={(e) => setNewDepositAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                      placeholder="Enter baseline deposit (e.g. 175.56)"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Mid-Period Cash Flow Amount (USD)
                  </label>
                  <p className="text-slate-500 text-[11px] mb-2">
                    Simulates a mid-trading cash flow (e.g. +100 for deposit, -50 for withdrawal). <strong>TWR isolates this cash flow so ROI % stays identical right after the deposit!</strong>
                  </p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={cashFlowAmount}
                      onChange={(e) => setCashFlowAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                      placeholder="e.g. 100.00 (or -50.00)"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2 mt-6">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingTrader(null)}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all cursor-pointer text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updatingDeposit}
                    className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-850 text-white font-medium rounded-xl shadow-lg transition-all cursor-pointer text-sm"
                  >
                    {updatingDeposit ? "Saving..." : depositUpdateMode === "cash_flow" ? "Simulate Cash Flow" : "Save Baseline"}
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleResetSimulation}
                  disabled={updatingDeposit}
                  className="w-full py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                >
                  ↺ Reset Trader to Original Live State
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {editingRule && (
        <div 
          onClick={() => setEditingRule(null)}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            
            <button
              type="button"
              onClick={() => setEditingRule(null)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-200 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">
              {editingRule.isNew ? "Add New Badge" : "Edit Badge Rule"}
            </h3>
            <p className="text-slate-400 text-xs mb-6">
              {editingRule.isNew
                ? "Define a new badge, its evaluation criteria, and points allocation."
                : `Configure criteria, points, and evaluation schedule for `}
              {!editingRule.isNew && <strong className="text-slate-200">{editingRule._id}</strong>}
              .
            </p>

            <form onSubmit={handleSaveRule} className="space-y-4">
              {editingRule.isNew && (
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Badge Name (Unique ID)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingRule._id}
                    onChange={(e) => setEditingRule({ ...editingRule, _id: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    placeholder="e.g. Consistency Master"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Points Allocated
                  </label>
                  <input
                    type="number"
                    required
                    value={editingRule.points}
                    onChange={(e) => setEditingRule({ ...editingRule, points: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                    placeholder="e.g. 50"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Cash Prize (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingRule.cashPrize || ""}
                    onChange={(e) => setEditingRule({ ...editingRule, cashPrize: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                    placeholder="e.g. ₹50,000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Select Badge Icon
                </label>
                <div className="grid grid-cols-6 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {[
                    { id: "medal_gold" },
                    { id: "shield_green" },
                    { id: "shield_blue" },
                    { id: "shield_orange" },
                    { id: "clock_purple" },
                    { id: "shield_purple_trophy" },
                    { id: "shield_blue_chart" },
                    { id: "shield_gold_crown" },
                    { id: "hexagon_teal_group" },
                    { id: "shield_red_fire" },
                    { id: "shield_green_check" },
                    { id: "medal_silver_star" },
                    { id: "trophy" }
                  ].map((badgeIcon) => (
                    <button
                      key={badgeIcon.id}
                      type="button"
                      onClick={() => setEditingRule({ ...editingRule, icon: badgeIcon.id })}
                      className={`p-1.5 rounded-lg border-2 transition-all flex items-center justify-center cursor-pointer ${
                        editingRule.icon === badgeIcon.id || (!editingRule.icon && badgeIcon.id === "shield_green")
                          ? "border-brand-500 bg-brand-500/10 scale-105"
                          : "border-transparent bg-slate-900/40 hover:bg-slate-900/80"
                      }`}
                      title={badgeIcon.id}
                    >
                      {renderBadgeIcon(badgeIcon.id, "w-8 h-8")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 border-t border-b border-slate-800 py-4 my-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-350 text-xs font-bold uppercase tracking-wider">
                    Evaluation Criteria Conditions
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [...(editingRule.conditions || [])];
                      updated.push({ metric: "profit", operator: "gte", value: 0 });
                      setEditingRule({ ...editingRule, conditions: updated });
                    }}
                    className="px-2.5 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Condition
                  </button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {(editingRule.conditions || []).map((cond: any, idx: number) => (
                    <div key={idx} className="flex gap-2 items-end bg-slate-950/40 p-3 rounded-xl border border-slate-850 relative">
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                              Metric
                            </label>
                            <select
                              value={cond.metric}
                              onChange={(e) => {
                                const updated = [...editingRule.conditions];
                                updated[idx].metric = e.target.value;
                                setEditingRule({ ...editingRule, conditions: updated });
                              }}
                              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                            >
                              <option value="profit">Profit ROI (%)</option>
                              <option value="volume">Volume (Lots)</option>
                              <option value="settledRebates">Settled Rebates ($)</option>
                              <option value="unsettledRebates">Unsettled Rebates ($)</option>
                              <option value="totalBalance">Current Balance ($)</option>
                              <option value="points">Total Points</option>
                              <option value="avgPoints">Average Points (6-Month)</option>
                              <option value="avgVolume">Average Volume Lots (6-Month)</option>
                              <option value="avgProfit">Average Profit ROI (6-Month)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                              Operator
                            </label>
                            <select
                              value={cond.operator}
                              onChange={(e) => {
                                const updated = [...editingRule.conditions];
                                updated[idx].operator = e.target.value;
                                setEditingRule({ ...editingRule, conditions: updated });
                              }}
                              className="w-full px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                            >
                              <option value="gte">&ge; (Greater Than or Equal)</option>
                              <option value="lte">&le; (Less Than or Equal)</option>
                              <option value="gt">&gt; (Strictly Greater)</option>
                              <option value="lt">&lt; (Strictly Less)</option>
                              <option value="eq">= (Equal)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                            Value
                          </label>
                          <input
                            type="text"
                            required
                            value={cond.value ?? ""}
                            onChange={(e) => {
                              const updated = [...editingRule.conditions];
                              updated[idx].value = e.target.value;
                              setEditingRule({ ...editingRule, conditions: updated });
                            }}
                            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                            placeholder="e.g. 8.0 or -10"
                          />
                        </div>
                      </div>

                      {editingRule.conditions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = editingRule.conditions.filter((_: any, i: number) => i !== idx);
                            setEditingRule({ ...editingRule, conditions: updated });
                          }}
                          className="p-2 bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 rounded-lg border border-rose-900/30 hover:border-rose-700 transition-all cursor-pointer h-9 flex items-center justify-center mb-0.5"
                          title="Remove Condition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  Next Evaluation Date & Time
                </label>
                <input
                  type="datetime-local"
                  required
                  value={editingRule.nextEvaluationTime ? new Date(new Date(editingRule.nextEvaluationTime).getTime() - new Date(editingRule.nextEvaluationTime).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ""}
                  onChange={(e) => setEditingRule({ ...editingRule, nextEvaluationTime: new Date(e.target.value).toISOString() })}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Custom Bullet Rules (One per line)
                </label>
                <textarea
                  value={editingRule.displayRules || ""}
                  onChange={(e) => setEditingRule({ ...editingRule, displayRules: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                  placeholder="e.g.&#10;Average Points (6-Month) must be at least 200&#10;Average Volume (6-Month) must be at least 15 Lots&#10;Average Profit ROI (6-Month) must be at least 20%"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  Badge Description
                </label>
                <textarea
                  value={editingRule.description || ""}
                  onChange={(e) => setEditingRule({ ...editingRule, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-sm"
                  placeholder="Describe how the badge is earned..."
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingRule(null)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingRule}
                  className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-850 text-white font-medium rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  {savingRule ? "Saving..." : "Save Rule"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
