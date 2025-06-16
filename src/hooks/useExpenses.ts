import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Expense } from '../types';
import { useAuth } from './useAuth';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchExpenses = async () => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedExpenses: Expense[] = data.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        notes: expense.notes || undefined,
      }));

      setExpenses(formattedExpenses);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: expenseData.amount,
          category: expenseData.category,
          date: expenseData.date,
          notes: expenseData.notes || null,
        })
        .select()
        .single();

      if (error) throw error;

      const newExpense: Expense = {
        id: data.id,
        amount: data.amount,
        category: data.category,
        date: data.date,
        notes: data.notes || undefined,
      };

      setExpenses(prev => [newExpense, ...prev]);
      return { data: newExpense, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const updateExpense = async (id: string, updates: Partial<Omit<Expense, 'id'>>) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          amount: updates.amount,
          category: updates.category,
          date: updates.date,
          notes: updates.notes || null,
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      const updatedExpense: Expense = {
        id: data.id,
        amount: data.amount,
        category: data.category,
        date: data.date,
        notes: data.notes || undefined,
      };

      setExpenses(prev => prev.map(exp => exp.id === id ? updatedExpense : exp));
      return { data: updatedExpense, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setExpenses(prev => prev.filter(exp => exp.id !== id));
      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [user]);

  return {
    expenses,
    loading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    refetch: fetchExpenses,
  };
};