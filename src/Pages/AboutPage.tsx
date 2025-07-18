import NavBar from "../Components/NavBar";

export default function AboutPage() {
    return <div>
        <NavBar />

        <h1>
            About
        </h1>

        {/* The Idea */}
        <p>
            I like board games. One of my favorites (which are also fun for non-boardgamers) is "Fun Facts".
            It's a social trivia game, inwhich all players answer questions and try to guess each-other's answers.
            It's a good time; but after oh so many games played, we've been through the entire deck of question cards!
        </p>

        <p>
            The idea of making new cards was suggested several times in my game groups,
            but actually fabricating physical cards is too much work for anyone to actually go through.
            And I'm not even going to mention how hard it would be to make these cards look good and fit with game's original cards.
        </p>

        <p>
            But everything changed when Barak, one of my gaming group players,
            mentioned that there was a digital solution for this problem in another trivia-ish game he owns.
            There exists a community made excel file filled with questions fitting the game!
        </p>

        <p>
            That's when the cogs in my head started spinning.
            Reading questions from an excel on your smartphone is doable, but it won't make a very pleasant experiance.
            Then, thought I, reading an excel through code is simple enough. Why not make an app for it?
        </p>

        {/* Inspirations */}
        <p>
            When I found out about Bruno Simon's <a href="https://bruno-simon.com/">portfolio</a> I was enamored.
            It works great even on phones!
            I then swore I'll make a 3d web project one day.
            And over a year later, came the idea for the excel-deck-app and it was a perfect match.
        </p>

        <p>
            Another inspiration was <a href="https://neal.fun/">neal.fun</a>, where he has a lot of small and fun projects.
            Some are games; some are informational; most are funny; all work great on phones as well as PCs.
        </p>

        <p>
            TODO: shorten this page. too much information. nobody cares.
        </p>
    </div>
}