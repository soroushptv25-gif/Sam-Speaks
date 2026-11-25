# Finishing the Figma prototype (about 15 minutes)

The Figma file already contains all 18 screens as editable layers, copied from the real app at tablet size (1024 × 768):

**https://www.figma.com/design/JeZEy5dRtOQLwfSxFK8PSd**

The clickable links between the screens still need to be added. The Figma connection used to build the file has reached the free (Starter) plan's limit, so this step is done by hand in Figma.

## 1. Open the file and switch to Prototype mode

1. Open the link above in a browser and sign in to Figma.
2. In the right-hand panel, click the **Prototype** tab. The default is **Design**.

## 2. Make the tall grown-up screens scroll

Screens s07, s08, s09, s10, s11, s14, s15 and s16 are taller than a tablet screen. For each one:

1. Click the frame's name on the canvas, for example "s07-adult-words".
2. In the **Design** tab, set **H** (height) to **768**.
3. Tick **Clip content**.
4. In the **Prototype** tab, set **Overflow scrolling** (also called **Scroll behavior**) to **Vertical**.

## 3. Add the links

For each row below:

1. Click the layer named in **Click on** inside the **From** screen. Double-click to go deeper into groups if needed.
2. Drag the small **+** circle on its right edge onto the **To** screen.
3. In the box that appears, choose **On tap**, **Navigate to**, and **Instant** or **Dissolve**.

| # | From | Click on | To | Notes |
|---|---|---|---|---|
| 1 | s01-welcome | "Open Sam's board" button | s02-board | |
| 2 | s02-board | the **water** picture | s03-board-water | "water" is spoken |
| 3 | s03-board-water | the **I** picture (or any picture) | s02-board | |
| 4 | s02-board | the **Feelings** group button | s04-board-feelings | Second tap = a feeling |
| 5 | s04-board-feelings | the **My board** button | s02-board | |
| 6 | s02-board | the **Grown-ups** button | s05-hold | Use **While pressing** instead of On tap if you like |
| 7 | s05-hold | the whole frame | s06-pin | Trigger: **After delay**, 1500 ms (the 1.5 s hold) |
| 8 | s06-pin | the number pad / PIN box | s07-adult-words | Stands for "enter PIN 2468" |
| 9 | s07-adult-words | **Add a picture** in the side menu | s08-add-step1 | |
| 10 | s08-add-step1 | **Use a drawing** | s09-add-filled | Grandpa, People, spot 12 |
| 11 | s09-add-filled | **Save picture** | s10-saved | New card highlighted |
| 12 | s10-saved | **Choice sets & practice** in the side menu | s11-choice-sets | |
| 13 | s11-choice-sets | **Show to Sam** on "Which drink?" | s12-choice-drinks | |
| 14 | s12-choice-drinks | the **juice** picture | s12b-choice-juice | |
| 15 | s12b-choice-juice | **Hold to finish** | s11-choice-sets | |
| 16 | s11-choice-sets | **Practise** on "How do you feel?" | s13-practice | |
| 17 | s13-practice | **Hold to finish** | s11-choice-sets | |
| 18 | s07-adult-words | **Settings** in the side menu | s14-settings | |
| 19 | s07-adult-words | **Usability study** in the side menu | s15-usability | |
| 20 | s07-adult-words | **Main board** in the side menu | s16-main-board | |
| 21 | s07-adult-words | **Open Sam's board** (bottom of side menu) | s02-board | |
| 22 | s14-settings | **Open Sam's board** | s17-board-sentence | Shows "Build a sentence" mode: I + want + water |

## 4. Set the starting points (flows)

In the **Prototype** tab, with nothing selected, add three flows under **Flows**:

- **Task 1: Sam asks for water.** Starts at s01-welcome.
- **Task 2: Add a personal picture.** Starts at s02-board.
- **Scenario 3: Choice set and practice.** Starts at s11-choice-sets.

Set **Device** to **iPad** (landscape) or **Custom 1024 × 768**.

## 5. Share the prototype with the instructor

1. Click **Present** (▶) at the top right to check the flows work.
2. In the presentation view, click **Share prototype**.
3. Set **Anyone with the link** to **can view**.
4. Click **Copy link**. It looks like `https://www.figma.com/proto/JeZEy5dRtOQLwfSxFK8PSd/...`.
5. Put that link in the report (Section 6.1) and on Moodle. Open it in a private browser window to make sure it works without signing in.
