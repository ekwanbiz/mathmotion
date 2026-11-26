"""Bab 3 T3 Consumer Mathematics: Savings and Investments, Credit and Debt (ENGLISH / DLP).
Ayat ikut buku teks English (T3_Chapter3.pdf); nombor dan nama sama dengan versi BM (bina_bab3_t3.py).
Nombor CONTOH ikut buku English: bahagian 3.2 buku English ada Example 15 dan 21 tambahan, jadi
CONTOH 15–20 BM menjadi EXAMPLE 16–20 dan 22."""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
exec(open(os.path.join(HERE, 'helpers.py')).read())
from graf import TR, PA, PU, AM, PK, GR, MU3, TX

SUBS = [{"no": "3.1", "name": "Savings & Investments", "col": "#34D399"}, {"no": "3.2", "name": "Credit & Debt Management", "col": "#FB923C"}]
COL = {x['no']: x['col'] for x in SUBS}
OUT.clear()
exec(open(os.path.join(HERE, 'umum.py')).read())


def pen(s, items, label=True):
    return (p('<b>Solution:</b>') if label else '') + steps(s, items)


def note(html, lb='Reminder:'):
    return f'<div class="sl-note"><b>{lb}</b> {html}</div>'


def R(v):
    return 'RM' + f'{v:,.2f}'.replace(',', ' ')


def r2(v):
    return round(v + 1e-9, 2)


def kp(P_, r, n, t):
    return r2(P_ * (1 + r / n) ** (n * t))


FM = f'<i>I</i> = <i>Prt</i>'
MV = f'<i>MV</i> = <i>P</i>(1 + {fr("<i>r</i>", "<i>n</i>")})<sup><i>nt</i></sup>'

# =====================================================================
# 3.1 SAVINGS AND INVESTMENTS
# =====================================================================
s = '3.1'
c = COL[s]
S(s, 'DEFINITION', 'Savings',
  de(s, '<b>Savings</b> refer to excess money deposited in the safe, money box or drawer. Extra money can also be deposited at a bank that will provide returns based on interest rates and savings periods.')
  + p('There are some common ways of saving in the bank.')
  + note('Credit counselling and credit agencies encourage each individual to save 10% of their monthly income.', 'Bulletin:'),
  table(['Type of account', 'Characteristics'], [
      ['Savings Account', 'The savings account holder can save any amount according to his ability. Interest rates are lower compared to fixed deposit accounts. The account holder can withdraw the savings at any time.'],
      ['Fixed Deposit Account', 'Save a certain amount of money for a certain period of time such as 3 months, 9 months or 1 year tenure. More competitive interest rates. Savings cannot be withdrawn before the maturity date.'],
      ['Current Account', 'Can be used for personal or business purposes. Payment to another party by cheque. Savings will not be paid interest and is subjected to service charges. Overdraft facility.']], c, 16, center=False))

S(s, 'DEFINITION', 'Investment',
  de(s, '<b>Investment</b> is an alternative step for future returns in the form of current income and capital gains.')
  + p('Types of investments are shares, unit trust and real estate.')
  + note('There are two types of investors, that is aggressive investors (invest in stock market) and moderate investors (buy unit trusts, bonds and equity funds).', 'Bulletin:'),
  cards(card('SHARES', 'Owner of the company', 'A company will issue shares for the purpose of raising capital. The shareholders will receive returns in the form of dividends and capital gains.', TR),
        card('UNIT TRUST', 'Managed by a professional manager', 'Unit trust companies collect money from investors and the money is invested in various potential companies.', PK),
        card('REAL ESTATE', 'Immovable assets', 'Investments on residential houses, shops, land and others. Factors: economic situations, income-generating capabilities (rent), location and property prospects.', AM)))

assert 5000 * 0.03 * 1 == 150
S(s, 'FORMULA', 'Simple interest',
  p('Interest for savings are rewards paid by financial institutions such as banks to depositors. The interests can be divided into two types, namely <b>simple interest</b> and <b>compound interest</b>.')
  + de(s, '<b>Simple interest</b> is a reward given to the depositor at a certain rate on the deposit amount (principal) for a certain period of time (in years).')
  + formula(FM, c)
  + p('<i>I</i> is the interest, <i>P</i> is the principal, <i>r</i> is the rate and <i>t</i> is the time in years.'),
  stack(work([('EXAMPLE 1', ['Encik Hafiz deposited RM5 000 at Bank Murni with interest rate of 3% per annum. How much is the interest earned by Encik Hafiz after 1 year?']),
              ('Solution:', [f'3% of RM5 000 = RM5 000 × {fr(3, 100)} = RM150', 'After 1 year, the interest earned by Encik Hafiz is RM150.'])], s, 1, 19),
        note('Rate is given in percentage form. Thus, we must divide the rate by a hundred. If the time is given in months, do not forget to change to year by dividing by 12 months.', 'Tips:')))

assert 6000 * 0.04 * 3 == 720 and abs(12000 * 0.05 * 9 / 12 - 450) < 1e-9
S(s, 'EXAMPLE 2', 'Calculating simple interest',
  p('Puan Aini deposits RM6 000 in a bank with interest rate of 4% per annum for a period of 3 years. Calculate the total interest that Puan Aini will receive for the 3-year period.')
  + work([('', ['<i>P</i> = 6 000, <i>r</i> = 4% = ' + fr(4, 100) + ' = 0.04, <i>t</i> = 3', f'Thus, interest {FM}', f'= RM6 000 × {fr(4, 100)} × 3', '= RM720'])], s, 1, 19)
  , work([('EXAMPLE 3', ['Ms Mei deposits RM12 000 in Bank Murni with interest rate of 5% per annum. Calculate the amount of interest Ms Mei will have after 9 months.']),
          ('Solution:', ['9 months = ' + fr(9, 12) + ' year', FM, f'= RM12 000 × {fr(5, 100)} × {fr(9, 12)}', '= RM450'])], s, 1, 19))

assert 9000 * 0.04 * 2 == 720 and abs(9000 * 0.04 * 3 - 1080) < 1e-9 and 6000 * 0.04 == 240 and 6000 * 0.05 == 300
S(s, 'EXAMPLE 4', 'Impact of savings period and interest rate',
  p('The changes in savings period in bank give different returns.')
  + p('<b>EXAMPLE 4</b> Encik Nazrin deposits RM9 000 in Bank Desa with interest rate of 4% per annum. Calculate the total savings of Encik Nazrin after he has saved for (a) 2 years (b) 3 years')
  + table(['(a) 2 years', '(b) 3 years'], [[f'Interest = RM9 000 × {fr(4, 100)} × 2 = RM720', f'Interest = RM9 000 × {fr(4, 100)} × 3 = RM1 080'],
                                          ['Total savings = RM9 000 + RM720 = RM9 720', 'Total savings = RM9 000 + RM1 080 = RM10 080']], c, 16)
  + note('The longer the savings period (at the bank), the higher the amount of interest earned. Therefore, the final amount of savings also increases.', 'Conclusion:'),
  stack(p('<b>EXAMPLE 5</b> Mrs Vanmathy deposits a sum of RM6 000 in a bank. What is the amount of Mrs Vanmathy\'s savings after 1 year if the interest rate given is (a) 4% per annum (b) 5% per annum'),
        table(['Interest rate', 'Total interest', 'Total savings'], [['4%', f'RM6 000 × {fr(4, 100)} × 1 = RM240', 'RM6 240'], ['5%', f'RM6 000 × {fr(5, 100)} × 1 = RM300', 'RM6 300']], c, 16),
        note('The difference between the total interests received is RM300 − RM240 = RM60. For the same principal, when the interest rates increase, the total savings at the end of the year also increase.', 'Conclusion:')))

assert kp(9000, 0.04, 1, 2) == 9734.4
S(s, 'FORMULA', 'Compound interest',
  de(s, '<b>Compound interest</b> is interest that is calculated based on the original principal and also the accumulated interest from the previous period of savings.')
  + p('For compound interest, the frequency of compounding on the principal can be different. For example, compounded once a year or once every 3 months and so on.')
  + formula(MV, c)
  + note('<i>MV</i> = matured value, <i>P</i> = principal, <i>r</i> = yearly interest rate, <i>n</i> = number of periods the interest is compounded per year, <i>t</i> = term in years', 'Reminder:'),
  work([('Referring to Example 4(a)', ['If compounded once a year, what is his savings at the end of the second year?']),
        ('First year', [f'Interest = RM9 000 × {fr(4, 100)} = RM360', 'Savings at the end of the first year = RM9 000 + RM360 = RM9 360']),
        ('Second year', ['Interest is calculated on RM9 360 (principal + first year interest).', f'Interest = RM9 360 × {fr(4, 100)} = RM374.40', 'Savings at the end of the second year = RM9 360 + RM374.40 = RM9 734.40']),
        ('Using the formula', ['<i>P</i> = 9 000, <i>r</i> = 0.04, <i>n</i> = 1, <i>t</i> = 2', f'<i>MV</i> = RM9 000(1 + {fr("0.04", 1)})<sup>(1)(2)</sup> = RM9 734.40'])], s, 1, 18))

v6 = kp(20000, 0.06, 2, 2); v7a = kp(12000, 0.06, 4, 1); v7b = kp(12000, 0.06, 12, 1)
assert v6 == 22510.18 and v7a == 12736.36 and v7b == 12740.13
S(s, 'EXAMPLE 6', 'Calculating compound interest',
  p('At the beginning of a year, Mrs Liew saves RM20 000 in savings account with a rate of 6% per annum and compounded every 6 months. What is Mrs Liew\'s total savings at the end of the second year?')
  + work([('', ['<i>P</i> = 20 000, <i>r</i> = 0.06, <i>n</i> = 2, <i>t</i> = 2', MV, f'= RM20 000(1 + {fr("0.06", 2)})<sup>(2)(2)</sup>', '= RM20 000(1.1255)', '= RM22 510.18'])], s, 1, 19)
  + note('What is the impact on the total cumulative returns, if the compounding rate increases in a year?', 'Quiz:'),
  work([('EXAMPLE 7', ['A bank offers 6% interest rate per annum for savings in fixed deposit account. If Iskandar saves RM12 000 at the beginning of the year, how much money is in his fixed deposit account at the end of the year if interest is compounded (a) once every 3 months? (b) once a month?']),
        ('(a) <i>n</i> = 4', [f'<i>MV</i> = RM12 000(1 + {fr("0.06", 4)})<sup>(4)(1)</sup>', '= RM12 736.36']), ('(b) <i>n</i> = 12', [f'<i>MV</i> = RM12 000(1 + {fr("0.06", 12)})<sup>(12)(1)</sup>', '= RM12 740.13']),
        ('', ['From Example 7, it was found that when the compounding frequency increases, the future value of savings also increases.'])], s, 1, 18))

v8 = kp(8000, 0.05, 4, 3)
assert v8 == 9286.04 and 8000 * 0.05 * 3 == 1200 and r2(v8 - 8000 - 1200) == 86.04 and 750 / 25000 * 100 == 3
S(s, 'EXAMPLE 8', 'Simple interest compared to compound interest',
  p('Mr Charles deposited RM8 000 in a savings account at Bank Berjaya for 3 years with interest rate of 5% per annum. What is the difference between the amount of interests Mr Charles earned if he was given compound interest (compounded once every 3 months) compared to simple interest?')
  + note('Based on Example 8, it is clear that savings with compound interest give higher returns than savings with simple interest.', 'Conclusion:'),
  work([('Simple interest', [f'Interest, <i>I</i> = RM8 000 × {fr(5, 100)} × 3 = RM1 200']),
        ('Compound interest', [f'<i>MV</i> = RM8 000(1 + {fr("0.05", 4)})<sup>(4)(3)</sup> = RM9 286.04', 'Total accumulated interest = RM9 286.04 − RM8 000 = RM1 286.04']),
        ('', ['Thus, the difference in the amount between simple interest and compound interest = RM1 286.04 − RM1 200 = RM86.04'])], s, 1, 19))

S(s, 'EXAMPLE 9', 'Islamic Banking',
  stack(
        p('Malaysia practises dual banking systems. They are conventional banking system and Islamic banking system. Islamic banking system is based on Islamic law (syarak), risk is managed according to the agreement, based on the principle of justice, halal and profit-sharing and without usury.'),
        note('The principle of wadiah: property or cash received with the agreement of the customer to be deposited in the bank. The bank is responsible for the security of the property or the money.', 'Bulletin:')),
  stack(work([('EXAMPLE 9', ['Encik Osman saved RM25 000 in a savings account in an Islamic bank, according to the principle of wadiah for 1 year. By the end of the year, he received a sum of RM25 750 as a return from the savings. An additional RM750 is a hibah (gift) from the bank. Calculate the percentage of hibah obtained by Encik Osman.']),
              ('Solution:', [f'Percentage of hibah = {fr("RM750", "RM25 000")} × 100% = 3%'])], s, 1, 19),
        note('3% is only a reference for savings and is not fixed.', 'Note:')))

ROI = f'Return on investment = {fr("Total return", "The value of the initial investment")} × 100%'
assert 6 / 100 * (4000 * 1.50) == 360 and abs((1.80 - 1.50) * 4000 - 1200) < 1e-9 and abs(1560 / 6000 * 100 - 26) < 1e-9
S(s, 'FORMULA', 'Return on investment (ROI)',
  de(s, 'Return on investment refers to the return value of each ringgit invested by the investor. In other words, return on investment is also a ratio of profit or loss derived from an investment.')
  + p('An investment is considered profitable (wise investment) when the present value of the investment and the amount of return received is more than the value of the original investment.')
  + formula(ROI, c),
  stack(cards(card('PROFITABLE', 'Wise investment', 'The present value of the investment and the amount of return received is more than the value of the original investment.', GR),
              card('UNPROFITABLE', 'Loss', 'The amount of return and the present value of the return is less than the value of the original investment.', PK)),
        note('Unit trust is a good investment alternative for medium term investment (3 to 5 years) and long term (over 5 years).', 'Reminder:')))

S(s, 'EXAMPLE 10', 'Return on investment for unit trusts',
  p('On 1 January 2018, Encik Faris invested 4 000 units valued at RM1.50 per unit in a unit trust. For the financial year ending 31 December 2018, the unit trust paid a dividend of 6%. On 1 January 2019, Encik Faris sold all the shares he owned at RM1.80 per unit. What is the return on investment for Encik Faris?')
  + note('Return for unit trusts: dividends (usually received at the end of the financial year), bonus shares and capital gain (increase in share price when shares are sold).', 'Bulletin:'),
  work([('Solution:', ['Initial capital = 4 000 × RM1.50 = RM6 000', f'Dividend = {fr(6, 100)} × RM6 000 = RM360', 'Increase in share price = RM1.80 − RM1.50 = RM0.30', 'Capital gain = RM0.30 × 4 000 units = RM1 200',
                         'Total return = RM360 + RM1 200 = RM1 560', f'Return on investment = {fr("RM1 560", "RM6 000")} × 100% = 26%'])], s, 1, 20))

km11 = 1100000 - 400000 - 50000 - 12000 - 12000 - 15000 - 380000
assert km11 == 231000 and 180000 + km11 == 411000 and abs(411000 / 500000 * 100 - 82.2) < 1e-9
S(s, 'EXAMPLE 11', 'Return on investment for real estate',
  p('Encik Kamal bought a shoplot at a price of RM500 000 on 1 January 2017. He paid 10% of the shoplot\'s purchase price of RM50 000. The shoplot was rented. On 31 December 2026, he sold the shoplot for RM1 100 000. The loan amount still owed to the bank was RM400 000. Meanwhile, the amount that has been amortized to the bank was RM380 000. The total rent collected throughout the possession of the shoplot is RM180 000. Calculate the return on investment obtained by Encik Kamal.')
  ,
  stack(table(['Other charges', 'Amount'], [['Legal cost', 'RM12 000'], ['Stamp duty (during sale and purchase)', 'RM12 000'], ['Agent’s commission', 'RM15 000']], c, 15),
  work([('Solution:', ['Total rent = RM180 000', 'Capital gain = RM1 100 000 − RM400 000 − RM50 000 − RM12 000 − RM12 000 − RM15 000 − RM380 000', '= RM231 000',
                         'Total return = RM180 000 + RM231 000 = RM411 000', f'Return on investment = {fr("RM411 000", "RM500 000")} × 100% = 82.2%'])], s, 1, 16)))

km12 = 750000 - 40000 - 600000 - 5000 - 3000 - 5000
assert km12 == 97000 and abs((80000 + km12) / 400000 * 100 - 44.25) < 1e-9
S(s, 'EXAMPLE 12', 'Problem solving: real estate',
  p('Encik Halim bought a house on 1 January 2015 at RM400 000 and cleared 10% down payment of RM40 000. He expects a return of 35% over 20 years. Encik Halim sold the house at a price of RM750 000 after having owned the house for 20 years. The loan amount amortized to the bank was RM600 000. During that period, he managed to earn a rent of RM80 000. What is the return on investment for Encik Halim for 20 years? Did he achieve his desire to get a return of 35%?')
  ,
  stack(table(['Other expenses', 'Amount'], [['Stamp duty (during sale and purchase)', 'RM5 000'], ['Agent\'s commission', 'RM3 000'], ['Legal cost during sale and purchase', 'RM5 000']], c, 15),
  work([('Solution:', ['Return on investment = Rent + Capital gain', '= RM80 000 + (RM750 000 − RM40 000 − RM600 000 − RM5 000 − RM3 000 − RM5 000)', '= RM80 000 + RM97 000', '= RM177 000',
                         f'Return on investment = {fr("RM177 000", "RM400 000")} × 100% = 44.25%',
                         'Encik Halim managed to obtain a rate of return of 44.25%. This rate exceeds the expected rate of return of 35%.'])], s, 1, 16)))

S(s, 'CONCEPT', 'Risk, return and liquidity',
  p('Three factors that should be taken into account by an investor prior to making an investment are as follows.')
  + table(['Factor', 'Meaning'], [['Potential investment risks', 'The possibility of an uncertainty that may incur from the investments made.'],
                                  ['The level of returns', 'Profit enjoyed by investors from investments.'],
                                  ['Liquidity aspects', 'Relating to how soon the investment or savings could be cashed out.']], c, 16, center=False),
  table(['Types of investments', 'Risk levels', 'Return levels', 'Liquidity levels'], [['Saving', 'Risk free', 'Low', 'High'], ['Fixed deposits', 'Risk free', 'Low', 'High'],
                                                                                  ['Company shares', 'High', 'High', 'Moderate'], ['Real estate', 'Moderate', 'High', 'Low'], ['Unit trust', 'Low', 'Moderate', 'High']], c, 16))

pr = [1.50, 1.20, 1.25, 1.60, 1.50]
un = [3000 / x for x in pr]
assert [round(u) for u in un] == [2000, 2500, 2400, 1875, 2000] and round(sum(un)) == 10775 and round(15000 / 10775, 2) == 1.39
S(s, 'FORMULA', 'Cost averaging strategy',
  de(s, 'Cost averaging strategy is a technique commonly practised by investors who invest in shares with fixed amount for a certain period such as monthly, quarterly or yearly regardless of the stock market conditions.')
  + p('Cost averaging strategies can help investors to buy shares with lower average cost and the total number of shares owned will be higher within the same investment period, as opposed to buying them in a lump sum or with a single purchase.')
  + formula(f'Average cost = {fr("Investment amount", "Number of share units owned")}', c),
  cards(card('Able to take advantage', 'Unit price changes', 'When the stock price is low, more units of shares can be purchased.', TR),
        card('Not influenced by emotions', 'Consistent', 'Invest consistently on a periodic basis the same amount of money without being influenced by emotions caused by share price fluctuation.', PK),
        card('Lower the risk of loss', 'Regular', 'Total investment is carried out on a regular and consistent manner, which helps investors to avoid losses associated with lump sum investment.', AM)))

S(s, 'EXAMPLE 13', 'Comparing investment strategies',
  p('Below are two investors who plan to invest in shares using different strategies. Puan Rosnah invests a lump sum of RM15 000 to buy Pelita Company shares in January. Puan Mei Lan invests RM3 000 in the designated months to buy the same shares.')
  + table(['Month', 'January', 'March', 'May', 'August', 'December'], [['Shares price per unit (RM)', *[f'{x:.2f}' for x in pr]]], c, 16)
  + bul(s, ['(a) Calculate the average cost per unit and the number of shares owned by Puan Rosnah and Puan Mei Lan.', '(b) Who is a wise investor? Justify your answer.']),
  work([('(a) Puan Rosnah', [f'Total shares = {fr("RM15 000", "RM1.50")} = 10 000 share units', 'Average cost per share = RM1.50']),
        ('Puan Mei Lan', ['Share units: 2 000 + 2 500 + 2 400 + 1 875 + 2 000 = 10 775 share units', f'Average cost per share = {fr("RM15 000", "10 775 units")} = RM1.39']),
        ('(b)', ['Puan Mei Lan is a wise investor for practising the cost averaging strategy that helped her to accumulate more shares with the same amount of money, at a lower average cost per share.'])], s, 1, 18))

roiA = (700 * 12 + 180000 * 0.04) / 300000 * 100
roiB = (300000 * 0.07) / 300000 * 100
roiC = (150000 * 0.01 + 150000 * 0.035) / 300000 * 100
assert abs(roiA - 5.2) < 1e-9 and abs(roiB - 7) < 1e-9 and abs(roiC - 2.25) < 1e-9
S(s, 'EXAMPLE 14', 'Problem solving: wise investor',
  p('Encik Rahim, Mr Lim and Mr Kumar had retired from their jobs and each received RM300 000 as gratuity from their company. They use different investment methods to invest. Who is a wise investor?')
  + table(['Investor', 'Investment method'], [['Encik Rahim', 'Bought a medium-cost apartment worth RM120 000 and receives a rental of RM700 per month. The balance is kept in a fixed deposits account with an interest rate of 4% per annum.'],
                                          ['Mr Lim', 'Invested RM300 000 in Manis Company shares at RM1.50 per unit. The company declared a dividend of 7% for that year.'],
                                          ['Mr Kumar', 'Deposited RM150 000 into a savings account with an interest rate of 1% per annum. The balance RM150 000 is kept in a fixed deposit account at 3.5% interest rate per annum.']], c, 15, center=False),
  work([('Encik Rahim (low level of risk)', [f'Rental = RM700 × 12 = RM8 400, Savings interest = {fr(4, 100)} × RM180 000 = RM7 200', f'ROI = {fr("RM8 400 + RM7 200", "RM300 000")} × 100% = 5.2%']),
        ('Mr Lim (high level of risk)', [f'Dividend = RM300 000 × {fr(7, 100)} = RM21 000', f'ROI = {fr("RM21 000", "RM300 000")} × 100% = 7%']),
        ('Mr Kumar (low level of risk)', [f'Interest = RM1 500 + RM5 250 = RM6 750', f'ROI = {fr("RM6 750", "RM300 000")} × 100% = 2.25%']),
        ('', ['Mr Lim is a wise investor because his returns on investment value is higher than Encik Rahim and Mr Kumar. Encik Rahim and Mr Kumar each chose investments with a lower level of risk.'])], s, 1, 16))

# =====================================================================
# 3.2 CREDIT AND DEBT MANAGEMENT
# =====================================================================
s = '3.2'
c = COL[s]
S(s, 'DEFINITION', 'Credit and debt',
  de(s, 'In the financial world, <b>credit</b> means a contractual agreement between the supplier (for instance bank or financial institution) and consumer. The consumer can borrow money from the supplier for any use or purchase and agree to repay within a certain period.')
  + p('Credit can also mean the amount of money that can be borrowed. For example, for credit card, if the credit card limit is RM10 000, then the card owner has the ability to buy goods or make transactions up to RM10 000 with the card.')
  ,
  stack(de(s, '<b>Debt</b> usually means an amount that has been borrowed but has not been settled. If a transaction is made using a credit card, the credit will be converted into debt.'),
        p(f'<b style="color:{c}">How do you manage credit and debt wisely?</b>'),
        bul(s, ['Credit card users need to settle the debt payment within the period stipulated by the bank to enjoy interest free period.', 'Pay the outstanding balance listed on the credit card statement.',
                'The minimum amount paid by the credit card holder provides opportunity for the bank to charge interest on the balance and may also incur late payment charges.'])))

S(s, 'EXAMPLE 15', 'Using a credit facility',
  p('Encik Hakim bought a washing machine at RM2 800 on 10 August 2018. He lacked RM1 000 in cash but has a Bank Cemerlang credit card. He was aware that the shortage of cash could be paid at the end of the month when he received his salary.')
  + bul(s, ['(a) Which credit facility can be used by Encik Hakim to overcome the shortage of money?', '(b) State the advantages and disadvantages of the payment method you specified in answer (a).']),
  work([('Solution:', ['(a) Encik Hakim can use the credit card facility.', '(b) The use of credit cards is more convenient if Encik Hakim repays his credit within the interest-free period to avoid any extra charges.'])], s, 1, 20))

S(s, 'CONCEPT', 'Advantages and disadvantages of credit cards',
  p('The use of credit cards is increasingly common today. As a consumer it is important for us to realize and understand the advantages and disadvantages of using credit cards.')
  + p('However, not all individuals are eligible for a credit card. There are several conditions that an applicant must adhere to: 21 years old and above, minimum income of RM24 000 per annum and meets other requirements set by the bank.'),
  table(['Advantages of credit cards', 'Disadvantages of credit cards'], [
      ['Credit card users can enjoy a reward system in the form of cash rebates or points redemption.', 'Incur charges such as annual fees, finance charges (interest), cash advance interest charges and late payment charges.'],
      ['Does not require us to carry a lot of cash.', 'Overspending.'],
      ['Easy and efficient payment method.', 'Some stores do not accept credit payment.'],
      ['Convenience of buying goods and services online.', '']], c, 16, center=False))

assert 0.05 * 4800 == 240
S(s, 'CONCEPT', 'Minimum payment and finance charges',
  p('The credit cardholder will receive a financial statement for the credit card monthly. In the statement, there are details such as credit limit, statement date, latest amount, minimum payment amount, type of charges and so on.')
  + p('The cardholder should pay the statement balance immediately so that no financial charges are incurred. But bank provides flexibility by allowing users to pay in a given period, known as the <b>interest free period</b>. Usually this period is 20 days from the statement date.'),
  stack(cards(card('MINIMUM PAYMENT', '5% of the total balance', 'of the credit card statement, or a minimum of RM50', TR),
              card('FINANCE CHARGE', 'Between 15% and 18% per annum', 'imposed on the balance in daily rate upon expiry of the interest free period', PK),
              card('LATE PAYMENT CHARGE', 'Minimum RM10 or 1%', 'of total outstanding balance, if no payment is made within the interest free period', AM)),
        note('If you pay only part of it, you will lose the interest-free period.', 'Tips:')))

f16b = r2(4560 * 0.18 * 15 / 365); f16c = r2(4800 * 0.18 * 15 / 365); l16 = r2((4800 + f16c) / 100)
assert f16b == 33.73 and f16c == 35.51 and l16 == 48.36 and r2(4560 + f16b) == 4593.73 and r2(4800 + f16c + l16) == 4883.87
S(s, 'EXAMPLE 16', 'Credit card usage',
  p('Encik Azman received his credit card statement for January 2019 from Bank Sentosa. The statement shows Encik Azman has the current amount (outstanding balance) of RM4 800. Assuming Encik Azman did not use his credit card in February. The finance charge rate is 18% per annum.')
  + bul(s, ['(a) What is the minimum payment to be paid?', '(b) If he only makes a minimum payment for January and the statement date is 15 days from the expiry date of the interest free period, what is the balance for the February statement?',
            '(c) If he missed his payment for January, what is the balance for his February statement?']),
  work([('(a)', [f'5% of the current amount = {fr(5, 100)} × RM4 800 = RM240', 'This amount exceeds RM50, thus the minimum payment to be paid by Encik Azman is RM240.']),
        ('(b)', ['Outstanding balance = RM4 800 − RM240 = RM4 560', 'Period subject to financial charges = 15 days = (15 ÷ 365) years', 'Interest charged = RM4 560 × [(18 ÷ 100) × (15 ÷ 365)] = RM33.73', 'Current amount (Outstanding balance) in February = RM4 560 + RM33.73 = RM4 593.73']),
        ('(c)', ['Interest charged = RM4 800 × [(18 ÷ 100) × (15 ÷ 365)] = RM35.51', f'Late payment charges = {fr(1, 100)} × (RM4 800 + RM35.51) = RM48.36', 'Current amount in February = RM4 800 + RM35.51 + RM48.36 = RM4 883.87'])], s, 1, 16))

hp = r2(240 / 0.30); kc = r2(40 / 0.30); cj = r2(hp / 100)
assert hp == 800 and kc == 133.33 and cj == 8 and r2(hp + kc + cj) == 941.33 and r2(941.33 - 899) == 42.33
S(s, 'EXAMPLE 17', 'Problem solving: buying online',
  p('Ms Chin wants to buy a handbag online and finds two interesting promotions: (a) Company L in Singapore offers promotional price of SGD240. For orders outside Singapore, SGD40 shipping charges apply. (b) Company V in Malaysia offers promotional price of RM899. Delivery is free for all orders to local address.')
  + p('Ms Chin intends to make payment by credit card and she understands that the bank will charge an additional 1% on each transaction from abroad. Assume the current exchange rate is RM1 = SGD0.30. As a wise consumer, which offer should Ms Chin choose? Justify your choice.'),
  work([('(a) Company L', ['Promotional price = SGD240 × (1 ÷ 0.30) = RM800.00', 'Postal charges = SGD40 × (1 ÷ 0.30) = RM133.33', f'Additional charges by bank = RM800.00 × {fr(1, 100)} = RM8.00', 'Actual price to be paid = RM800.00 + RM133.33 + RM8.00 = RM941.33']),
        ('(b) Company V', ['Actual price to be paid = RM899']),
        ('', ['Although the promotional price offered by Company L is cheaper, but the actual price payable is higher due to the additional charges incurred for online purchases from Company L. So, Ms Chin should buy from Company V to save RM42.33.'])], s, 1, 17))

AS = f'<i>A</i> = <i>P</i> + <i>Prt</i>'
assert 90000 * 0.9 == 81000 and abs(81000 * 0.035 * 5 - 14175) < 1e-6 and abs((81000 + 14175) / 60 - 1586.25) < 1e-9 and (15000 + 15000 * 0.05 * 5) / 60 == 312.5
S(s, 'FORMULA', 'Loan repayment: flat interest',
  p('Each loan will be charged interest on the loan from the date the loan was made. There are two types of calculation methods for loan interest, namely flat interest rate and interest on balance.')
  + de(s, 'In the <b>flat interest</b> method, the interest rate will be calculated on the original loan amount over the term of the loan. So the amount of interest charged per month is fixed.')
  + formula(f'{AS} &nbsp;&nbsp; Monthly instalment = {fr("<i>A</i>", "number of months")}', c)
  ,
  stack(p('<i>A</i> = total repayment, <i>P</i> = principal, <i>r</i> = interest rate per annum, <i>t</i> = loan period in years.'), de(s, 'The <b>monthly instalment</b> is the total amount paid by the borrower to the bank every month to settle the balance of the loan.'),
        note('Total loan balance is the amount deducted from the initial down payment plus the amount of interest charged.', 'Reminder:')))

S(s, 'EXAMPLE 18', 'Car loan',
  p('Mrs Yap bought a car worth RM90 000 on credit. She pays 10% down payment and the balance is payable in instalments over 5 years. The flat interest rate imposed by the bank is 3.5% per annum. What is the amount of repayment and monthly instalment payable by Mrs Yap?')
  + note('Total repayment can be calculated with the formula <i>A</i> = <i>P</i> + <i>Prt</i>.', 'Tips:'),
  work([
        ('Solution:', ['Down payment = 10% × RM90 000 = RM9 000', 'Loan amount = Purchase price − down payment = RM90 000 − RM9 000 = RM81 000', f'Interest for 5 years = RM81 000 × {fr("3.5", 100)} × 5 years = RM14 175', 'Total repayment = RM81 000 + RM14 175 = RM95 175',
                       f'Monthly instalment = {fr("RM95 175", "60 months")} = RM1 586.25 per month']),
        ], s, 1, 19))

S(s, 'EXAMPLE 19', 'Personal loan',
  p('Encik Firdaus obtained a personal loan of RM15 000 from Bank Mulia with an interest rate of 5% per annum. The repayment period is 5 years. What is the monthly instalment to be paid by Encik Firdaus?')
  + note('Total repayment can be calculated with the formula <i>A</i> = <i>P</i> + <i>Prt</i>.', 'Tips:'),
  work([('Solution:', ['<i>A</i> = <i>P</i> + <i>Prt</i>', 'Loan, <i>P</i> = RM15 000, <i>r</i> = 5%, <i>t</i> = 5 years', f'Thus, total repayment <i>A</i> = RM15 000 + (RM15 000 × {fr(5, 100)} × 5)', '= RM15 000 + RM3 750 = RM18 750',
                         f'Monthly instalment = {fr("RM18 750", "60 months")} = RM312.50'])], s, 1, 20))

b, rows, tot = 12000.0, [], 0
for k in range(3):
    f_ = r2(b * 0.05 / 12); tot += f_
    rows.append((b, f_, r2(b + f_), r2(b + f_ - 300))); b = r2(b + f_ - 300)
assert [x[1] for x in rows] == [50.0, 48.96, 47.91] and r2(tot) == 146.87 and rows[-1][3] == 11246.87
ORDN = ['First', 'Second', 'Third']
S(s, 'EXAMPLE 20', 'Interest on balance',
  p('In addition to the flat interest, banks also offer <b>interest on balance</b> for certain types of loans. The amount of interest charged each month on the loan depends on the amount of the loan balance for that month. Since the loan balance is reduced every month, the amount of interest for each month will also be reduced.')
  + p('<b>EXAMPLE 20</b> Encik Harith obtained a personal loan of RM12 000 from Bank Mulia with an interest rate of 5% on the balance. The monthly instalment is RM300. Calculate the amount of interest payable by Encik Harith for the first three months.'),
  work([(f'{ORDN[k]} month', [f'{ORDN[k]} month interest = {R(b0)} × {fr(5, 100)} × {fr(1, 12)} = {R(f_)}', f'Balance after {ORDN[k].lower()} instalment = {R(t_)} − RM300 = {R(e)}']) for k, (b0, f_, t_, e) in enumerate(rows)]
       + [('', ['Total interest for the first three months is RM50.00 + RM48.96 + RM47.91 = RM146.87'])], s, 1, 17))

S(s, 'EXAMPLE 21', 'Vehicle loan',
  p('Sofea wants to buy a car worth RM55 000 and has paid a deposit of RM5 500. The balance will be settled through a vehicle loan. State the advantages and disadvantages of the vehicle loan chosen by Sofea.'),
  table(['Advantages', 'Disadvantages'], [['Repayment of vehicle loan in monthly instalments allows Sofea to own the car.', 'The car will be repossessed if instalments are not made.'],
                                         ['Does not require a lump sum payment.', 'The total amount of repayment is high due to interest.']], c, 18, center=False))

aA = 45000 + 45000 * 0.04 * 9; aB = 45000 + 45000 * 0.045 * 5
assert aA == 61200 and aB == 55125 and r2(aA / 108) == 566.67 and r2(aB / 60) == 918.75
S(s, 'EXAMPLE 22', 'Problem solving: choosing a loan',
  p('Ms Nadia is a teacher with a monthly income of RM3 000. She decides to buy a new car to commute to work. She contacts two banks to get a loan of RM45 000. In addition, every month she also needs RM1 800 to cover other expenses. Suggest to Ms Nadia which bank is best suited for her car loan. State your reasons.')
  ,
  stack(table(['Loan details', 'Bank A', 'Bank B'], [['Loan amount', 'RM45 000', 'RM45 000'], ['Payment period', '9 years', '5 years'], ['Interest rate', '4%', '4.5%'], ['Guarantor', 'Not required', 'Required']], c, 18),
        note('Do not borrow money from unlicensed moneylenders as the loan imposes very high interest charge with daily compound.', 'Tips:')))

S(s, 'EXAMPLE 22 (continued)', 'Solution',
  work([('Understanding the problem', ['The amount of monthly instalments payable by Ms Nadia provided that it is not burdensome.']),
        ('Planning a strategy', ['Calculate the interest of the loan. Calculate monthly instalment payable.'])], s, 1, 19),
  work([('Implementing the strategy', [f'Bank A: <i>A</i> = RM45 000 + RM45 000 × {fr(4, 100)} × 9 = RM61 200', f'Monthly instalment = {fr("RM61 200", "108 months")} = RM566.67',
                                   f'Bank B: <i>A</i> = RM45 000 + RM45 000 × {fr("4.5", 100)} × 5 = RM55 125', f'Monthly instalment = {fr("RM55 125", "60 months")} = RM918.75']),
        ('Making a conclusion', ['Balance of Ms Nadia\'s income = RM3 000 − RM1 800 = RM1 200. Both instalments do not exceed this balance.',
                                'Ms Nadia should choose Bank A because Bank A charges lower interest compared to Bank B. However, different payment term results in different amount of interest paid. Therefore, Ms Nadia could also choose Bank B.'])], s, 1, 16))

OUTFILE = os.environ.get('NOTA_OUT') or os.path.join(HERE, '..', '..', 'pengguna', 'slides_en.js')
HEAD = '/* Nota Bab 3 T3 (ENGLISH / DLP), ayat ikut buku teks English. Dijana skrip bina_bab3_t3_en.py; jangan sunting dengan tangan. */'
exec(open(os.path.join(HERE, 'tail.py')).read())
