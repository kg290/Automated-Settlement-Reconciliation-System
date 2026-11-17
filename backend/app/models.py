from sqlalchemy import (
    Column, String, Integer, Numeric, DateTime, Text, Enum, ForeignKey, Index
)
from sqlalchemy.sql import func
from .database import Base

class InternalTransaction(Base):
    __tablename__ = "internal_transactions"

    transaction_id = Column(String(64), primary_key=True, index=True)
    order_id = Column(String(64), index=True)
    customer_id = Column(String(64), index=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    amount = Column(Numeric(12, 2), nullable=False)
    fee_expected = Column(Numeric(12, 4), nullable=False)
    net_expected = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), default="USD")
    type = Column(String(20), default="PAYMENT")
    status = Column(String(20), default="SUCCESS")
    payment_method = Column(String(32))
    reference_id = Column(String(64), index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class BankSettlement(Base):
    __tablename__ = "bank_settlements"

    settlement_id = Column(String(64), primary_key=True, index=True)
    bank_batch_id = Column(String(64), index=True)
    internal_txn_id = Column(String(64), nullable=True, index=True)
    settlement_date = Column(DateTime, nullable=False, index=True)
    gross_amount = Column(Numeric(12, 2), nullable=False)
    bank_fee = Column(Numeric(12, 4), nullable=False)
    net_amount = Column(Numeric(12, 2), nullable=False)
    currency = Column(String(3), default="USD")
    type = Column(String(20), default="SETTLEMENT")
    bank_reference = Column(String(64), index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class ReconciliationRun(Base):
    __tablename__ = "reconciliation_runs"

    run_id = Column(String(64), primary_key=True)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    # Platform side metrics
    total_platform_txns = Column(Integer, default=0)
    total_platform_volume = Column(Numeric(14, 2), default=0)
    total_platform_fees = Column(Numeric(14, 2), default=0)
    total_platform_net = Column(Numeric(14, 2), default=0)
    
    # Bank side metrics
    total_bank_settlements = Column(Integer, default=0)
    total_bank_volume = Column(Numeric(14, 2), default=0)
    total_bank_fees = Column(Numeric(14, 2), default=0)
    total_bank_net = Column(Numeric(14, 2), default=0)
    
    # Gaps & Variances
    gross_variance = Column(Numeric(14, 2), default=0) # Platform Volume - Bank Volume
    fee_variance = Column(Numeric(14, 2), default=0)   # Platform Fees - Bank Fees
    net_variance = Column(Numeric(14, 2), default=0)   # Platform Net - Bank Net
    
    # Planted Gap Specific Summary
    timing_diff_count = Column(Integer, default=0)
    timing_diff_amount = Column(Numeric(14, 2), default=0)
    
    rounding_drift_count = Column(Integer, default=0)
    rounding_drift_amount = Column(Numeric(14, 2), default=0)
    
    duplicate_count = Column(Integer, default=0)
    duplicate_amount = Column(Numeric(14, 2), default=0)
    
    orphan_refund_count = Column(Integer, default=0)
    orphan_refund_amount = Column(Numeric(14, 2), default=0)
    
    # Matching quality
    clean_matched_count = Column(Integer, default=0)
    unmatched_platform_count = Column(Integer, default=0)
    unmatched_bank_count = Column(Integer, default=0)
    match_rate_percentage = Column(Numeric(5, 2), default=0)
    
    status = Column(String(32), default="COMPLETED")
    executed_at = Column(DateTime, server_default=func.now())

class ReconciliationItem(Base):
    __tablename__ = "reconciliation_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(64), index=True, nullable=False)
    
    internal_txn_id = Column(String(64), nullable=True, index=True)
    settlement_id = Column(String(64), nullable=True, index=True)
    
    # Category of reconciliation outcome
    # MATCHED, TIMING_DIFFERENCE, DUPLICATE_BANK, DUPLICATE_PLATFORM,
    # ORPHAN_REFUND, ROUNDING_VARIANCE, UNMATCHED_INTERNAL, UNMATCHED_BANK
    status = Column(String(40), nullable=False, index=True)
    discrepancy_category = Column(String(64), nullable=True, index=True)
    
    platform_amount = Column(Numeric(12, 2), nullable=True)
    bank_amount = Column(Numeric(12, 2), nullable=True)
    amount_variance = Column(Numeric(12, 2), default=0) # platform - bank
    
    platform_fee = Column(Numeric(12, 4), nullable=True)
    bank_fee = Column(Numeric(12, 4), nullable=True)
    fee_variance = Column(Numeric(12, 4), default=0)
    
    platform_date = Column(DateTime, nullable=True)
    settlement_date = Column(DateTime, nullable=True)
    timing_lag_days = Column(Integer, nullable=True)
    
    root_cause_explanation = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    financial_impact_category = Column(String(40), nullable=True)
    
    investigation_status = Column(String(32), default="PENDING") # PENDING, REVIEWED, RESOLVED, DISMISSED
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

class AuditAction(Base):
    __tablename__ = "audit_actions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    run_id = Column(String(64), nullable=False)
    item_id = Column(Integer, nullable=True)
    action_type = Column(String(64), nullable=False) # e.g. NOTE_ADDED, MARK_RESOLVED, ACCRUE_ASSET, CLAWBACK_INITIATED
    performed_by = Column(String(64), default="Reconciliation Auditor")
    notes = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
