import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  Briefcase, FileText, Clock, AlertOctagon, 
  ChevronRight, Activity, TrendingUp, TrendingDown 
} from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Simulate API delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const metrics = [
    { label: "Active cases", val: "24", delta: "+3 this week", up: true, icon: Briefcase },
    { label: "Docs reviewed", val: "187", delta: "+12 today", up: true, icon: FileText },
    { label: "Avg review time", val: "4.2h", delta: "18% faster", up: true, icon: Clock },
    { label: "Risk alerts", val: "7", delta: "2 unresolved", up: false, icon: AlertOctagon },
  ];

  const cases = [
    { name: "Henderson v. Meridian Corp.", type: "Corporate Litigation", status: "active" },
    { name: "Patel Estate Trust Review", type: "Estate Planning", status: "review" },
    { name: "NDA — Orion Ventures", type: "Contract", status: "pending" },
    { name: "Kumar IP Filing #2024-11", type: "Intellectual Property", status: "active" },
    { name: "Retail Lease — Block 44", type: "Real Estate", status: "closed" },
  ];

  const activity = [
    { text: <><strong>AI flagged 3 risk clauses</strong> in Orion Ventures NDA</>, time: "2 min ago", type: "alert" },
    { text: <><strong>Document uploaded:</strong> Henderson deposition transcript</>, time: "41 min ago", type: "action" },
    { text: <><strong>Case updated:</strong> Patel Estate — court date confirmed</>, time: "2h ago", type: "update" },
    { text: <><strong>New message</strong> from client Sarah Nguyen</>, time: "3h ago", type: "msg" },
    { text: <><strong>Contract analysis complete</strong> — Block 44 lease review</>, time: "Yesterday", type: "success" },
  ];

  // Dummy Chart Data
  const casesData = [
    { name: 'Mon', cases: 12 },
    { name: 'Tue', cases: 19 },
    { name: 'Wed', cases: 15 },
    { name: 'Thu', cases: 22 },
    { name: 'Fri', cases: 28 },
    { name: 'Sat', cases: 24 },
    { name: 'Sun', cases: 30 },
  ];

  const risksData = [
    { name: 'Week 1', risks: 45 },
    { name: 'Week 2', risks: 32 },
    { name: 'Week 3', risks: 28 },
    { name: 'Week 4', risks: 14 },
  ];

  return (
    <div className="p-8 pb-16 max-w-[1600px] mx-auto space-y-8">
      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <Card key={i} className="hover:border-primary/50 transition-colors group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {m.label}
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                <m.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </>
              ) : (
                <>
                  <div className="text-3xl font-bold font-serif mb-1">{m.val}</div>
                  <div className={`flex items-center text-xs font-medium ${m.up ? "text-emerald-500" : "text-destructive"}`}>
                    {m.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {m.delta}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
               <Activity className="w-4 h-4 text-primary" /> Active Cases Trend
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {loading ? (
               <Skeleton className="w-full h-full rounded-xl" />
             ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={casesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C9A646" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#C9A646" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#7B859E" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#7B859E" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111520', borderColor: '#1E2535', borderRadius: '8px' }}
                    itemStyle={{ color: '#C9A646' }}
                  />
                  <Area type="monotone" dataKey="cases" stroke="#C9A646" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" />
                </AreaChart>
              </ResponsiveContainer>
             )}
          </CardContent>
        </Card>

        <Card className="hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
               <AlertOctagon className="w-4 h-4 text-destructive" /> Risk Alerts by Week
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
             {loading ? (
               <Skeleton className="w-full h-full rounded-xl" />
             ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={risksData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" stroke="#7B859E" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#7B859E" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111520', borderColor: '#1E2535', borderRadius: '8px' }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="risks" fill="#C9A646" radius={[4, 4, 0, 0]} opacity={0.8} />
                  </BarChart>
                </ResponsiveContainer>
             )}
          </CardContent>
        </Card>
      </div>

      {/* Lists Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
            <CardTitle className="text-base">Recent cases</CardTitle>
            <Button variant="ghost" size="sm" className="h-8 group">
              View all <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            {loading ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="space-y-2"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              cases.map((c, i) => (
                <div className={`group flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors cursor-pointer ${i !== cases.length - 1 ? 'border-b border-border/50' : ''}`} key={c.name}>
                  <div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.type}</div>
                  </div>
                  <Badge variant={c.status} className="capitalize">{c.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="border-b border-border/50 pb-4">
            <CardTitle className="text-base">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0 py-2 flex-1">
             {loading ? (
              <div className="p-5 space-y-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-2 w-2 rounded-full mt-2 shrink-0" />
                    <div className="space-y-2 flex-1"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/4" /></div>
                  </div>
                ))}
              </div>
            ) : (
              activity.map((a, i) => {
                let dotColor = "bg-primary";
                if(a.type === 'alert') dotColor = "bg-destructive";
                if(a.type === 'success') dotColor = "bg-emerald-500";
                
                return (
                  <div className="group flex gap-4 p-4 px-5 hover:bg-white/[0.02] transition-colors cursor-pointer" key={i}>
                    <div className={`w-2 h-2 rounded-full ${dotColor} mt-2 shrink-0 group-hover:scale-125 transition-transform`} />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground [&>strong]:text-foreground [&>strong]:font-medium leading-relaxed group-hover:text-foreground/90 transition-colors">
                        {a.text}
                      </div>
                      <div className="text-xs text-muted-foreground/60 mt-1.5 font-medium">{a.time}</div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
