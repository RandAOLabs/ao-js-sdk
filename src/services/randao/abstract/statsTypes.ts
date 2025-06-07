/**
 * Type representing monthly random response statistics
 */
export interface MonthlyRandomResponses {
    /**
     * Month in YYYY-MM format for Plotly compatibility
     */
    month: string;
    /**
     * Number of random responses in that month
     */
    numResponses: number;
}
