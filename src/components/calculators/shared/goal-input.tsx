import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Goal } from '@/lib/types';

export type { Goal };

interface GoalInputProps {
  goals: Goal[];
  setGoals: (goals: Goal[]) => void;
  goalTypes: { value: string; label: string }[];
}

export function GoalInput({ goals = [], setGoals, goalTypes = [] }: GoalInputProps) {
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({});

  const handleAddGoal = () => {
    if (newGoal.type && newGoal.target && newGoal.timeframe) {
      const goal: Goal = {
        id: crypto.randomUUID(),
        type: newGoal.type,
        target: Number(newGoal.target),
        timeframe: Number(newGoal.timeframe),
        description: newGoal.description || '',
      };
      setGoals([...(goals || []), goal]);
      setNewGoal({});
    }
  };

  const handleRemoveGoal = (id: string) => {
    setGoals((goals || []).filter((goal) => goal.id !== id));
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-4">
      {/* Existing Goals */}
      {(goals || []).map((goal) => (
        <div key={goal.id} className="flex items-center gap-4 p-4 border rounded-lg">
          <div className="flex-1 grid gap-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">{goalTypes.find(t => t.value === goal.type)?.label || goal.type}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveGoal(goal.id)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {formatCurrency(goal.target)} in {goal.timeframe} years
            </div>
            {goal.description && (
              <div className="text-sm text-muted-foreground">{goal.description}</div>
            )}
          </div>
        </div>
      ))}

      {/* Add New Goal */}
      <div className="grid gap-4 p-4 border rounded-lg">
        <div className="grid gap-2">
          <Label>Goal Type</Label>
          <Select
            value={newGoal.type}
            onValueChange={(value) => setNewGoal({ ...newGoal, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a goal type" />
            </SelectTrigger>
            <SelectContent>
              {(goalTypes || []).map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Target Amount</Label>
          <Input
            type="number"
            value={newGoal.target || ''}
            onChange={(e) => setNewGoal({ ...newGoal, target: parseFloat(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>

        <div className="grid gap-2">
          <Label>Timeframe (years)</Label>
          <Input
            type="number"
            value={newGoal.timeframe || ''}
            onChange={(e) => setNewGoal({ ...newGoal, timeframe: parseInt(e.target.value) || 0 })}
            placeholder="0"
          />
        </div>

        <div className="grid gap-2">
          <Label>Description (optional)</Label>
          <Input
            value={newGoal.description || ''}
            onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            placeholder="Enter a description"
          />
        </div>

        <Button onClick={handleAddGoal} className="w-full" disabled={!newGoal.type || !newGoal.target || !newGoal.timeframe}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>
    </div>
  );
}